use anyhow::{Context, Ok, Result};
use parking_lot::RwLock;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::http::{self, Method, Request, Response};
use tauri::{AppHandle, Manager};

type CatalogEntries = Vec<assets::catalog::CatalogEntry>;

pub struct AssetsState {
    scan: assets::AssetScan,
    catalog: CatalogEntries,
    sprite_png_cache: RwLock<std::collections::HashMap<u32, Arc<Vec<u8>>>>,
}

fn resolve_assets_dir(app: &AppHandle) -> Result<PathBuf> {
    let dev = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("assets");

    if dev.is_dir() {
        return Ok(dev);
    }

    let res = app.path().resource_dir().context("resource_dir() failed")?;
    let bundled = res.join("assets");

    if bundled.is_dir() {
        return Ok(bundled);
    }

    let cwd = std::env::current_dir().unwrap_or_default();

    anyhow::bail!(
        "assets dir not found. cwd={:?} tried dev={:?} bundled={:?}",
        cwd,
        dev,
        bundled
    );
}

impl AssetsState {
    pub fn init(app: &AppHandle) -> Result<Self> {
        let assets_dir = resolve_assets_dir(&app)?;

        let scan = assets::scan_assets_dir(&assets_dir)
            .with_context(|| format!("scan_assets_dir failed"))?;

        assets::validate_assets(&scan).context("validate_assets failed")?;

        let catalog_path = scan.root.join("catalog-content.json");
        let catalog = assets::catalog::load_catalog(&catalog_path)
            .with_context(|| format!("failed to load catalog: {}", catalog_path.display()))?;

        Ok(Self {
            scan,
            catalog,
            sprite_png_cache: RwLock::new(std::collections::HashMap::new()),
        })
    }

    pub fn sprite_png(&self, sprite_id: u32) -> Result<Arc<Vec<u8>>> {
        // Make sure to hit cache and return if already been generated
        if let Some(hit) = self.sprite_png_cache.read().get(&sprite_id) {
            return Ok(hit.clone());
        }

        let entry = assets::sprites::find_sprite_entry(&self.catalog, sprite_id)
            .ok_or_else(|| anyhow::anyhow!("sprite_id {sprite_id} not found in catalog"))?;

        assets::catalog::ensure_has_sprite_fields(entry)?;

        let sheet_path = self.scan.root.join(&entry.file);
        let compressed = std::fs::read(&sheet_path)
            .with_context(|| format!("failed to read sheet: {}", sheet_path.display()))?;

        let bmp_bytes = assets::lzma::decompress_cipsoft_lzma_asset(&compressed)
            .context("failed to decompress bmp.lzma")?;

        let info = assets::bmp::parse_bmp_info(&bmp_bytes)?;
        let rect = assets::sprites::sprite_rect_from_sheet(entry, sprite_id, &info)?;

        let dynamic_image =
            image::load_from_memory_with_format(&bmp_bytes, image::ImageFormat::Bmp)?;
        let rgba = dynamic_image.to_rgba8();
        let cropped = image::imageops::crop_imm(&rgba, rect.x, rect.y, rect.w, rect.h).to_image();

        let mut png = Vec::new();
        image::DynamicImage::ImageRgba8(cropped)
            .write_to(&mut std::io::Cursor::new(&mut png), image::ImageFormat::Png)?;

        let png = Arc::new(png);
        self.sprite_png_cache.write().insert(sprite_id, png.clone());
        Ok(png)
    }
}

fn parse_sprite_id(path: &str) -> Option<u32> {
    let path = path.trim_start_matches("/");
    let mut it = path.split("/");

    if it.next()? != "sprite" {
        return None;
    }

    let file = it.next()?;
    let id_str = file.strip_suffix(".png").unwrap_or(file);
    id_str.parse::<u32>().ok()
}

fn with_cors(mut builder: http::response::Builder, origin: &str) -> http::response::Builder {
    builder = builder
        .header("Access-Control-Allow-Origin", origin)
        .header("Vary", "Origin")
        .header("Access-Control-Allow-Methods", "GET, OPTIONS")
        .header("Access-Control-Allow-Headers", "*")
        // opcional, mas ajuda em alguns casos:
        .header("Cross-Origin-Resource-Policy", "cross-origin");

    builder
}

pub fn handle(app: &AppHandle, request: Request<Vec<u8>>) -> Response<Vec<u8>> {
    let path = request.uri().path().to_string();

    let origin = request
        .headers()
        .get("Origin")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("*");

    if request.method() == Method::OPTIONS {
        return with_cors(http::Response::builder().status(204), origin)
            .body(Vec::new())
            .unwrap();
    }

    let state = app.state::<AssetsState>();

    if let Some(sprite_id) = parse_sprite_id(&path) {
        return match state.sprite_png(sprite_id) {
            std::result::Result::Ok(png) => with_cors(
                http::Response::builder()
                    .status(200)
                    .header("Content-Type", "image/png"),
                origin,
            )
            .body(png.as_ref().to_owned())
            .unwrap(),

            std::result::Result::Err(err) => with_cors(
                http::Response::builder()
                    .status(404)
                    .header("Content-Type", "text/plain; charset=utf-8"),
                origin,
            )
            .body(format!("sprite {sprite_id} not found: {err}").into_bytes())
            .unwrap(),
        };
    }

    with_cors(
        http::Response::builder()
            .status(404)
            .header("Content-Type", "text/plain; charset=utf-8"),
        origin,
    )
    .body(format!("unknown route: {path}").into_bytes())
    .unwrap()
}
