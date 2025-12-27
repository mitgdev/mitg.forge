use anyhow::{Result, anyhow};
use std::io::Cursor;
use std::path::PathBuf;

fn main() -> Result<()> {
    let mut args = std::env::args().skip(1);

    let dir = args
        .next()
        .ok_or_else(|| anyhow!("usage: inspect <assets_dir> [--sprite-id N] [--dump out.png]"))?;

    let mut sprite_id: Option<u32> = None;
    let mut dump_path: Option<PathBuf> = None;

    while let Some(a) = args.next() {
        match a.as_str() {
            "--sprite-id" => {
                let v = args
                    .next()
                    .ok_or_else(|| anyhow!("--sprite-id requires a number"))?;
                sprite_id = Some(v.parse::<u32>()?);
            }
            "--dump" => {
                let v = args
                    .next()
                    .ok_or_else(|| anyhow!("--dump requires a path"))?;
                dump_path = Some(PathBuf::from(v));
            }
            "--help" | "-h" => {
                println!("usage: inspect <assets_dir> [--sprite-id N] [--dump out.png]");
                return Ok(());
            }
            other => return Err(anyhow!("unknown arg: {other}")),
        }
    }

    // (opcional) se passou --dump sem --sprite-id, não tem como saber o que recortar
    if dump_path.is_some() && sprite_id.is_none() {
        return Err(anyhow!("--dump requires --sprite-id"));
    }

    let scan = assets::scan_assets_dir(&dir)?;
    println!("assets_dir={}", scan.root.display());
    println!("files={}", scan.files.len());
    println!("has_catalog={}", scan.has_catalog);
    println!("sprites_count={}", scan.sprites_count);
    println!("appearances_count={}", scan.appearances_count);

    assets::validate_assets(&scan)?;

    let catalog_path = scan.root.join("catalog-content.json");
    let entries = assets::catalog::load_catalog(&catalog_path)?;
    let summary = assets::catalog::summarize(&entries);

    println!("\n=== catalog-content.json ===");
    println!("entries_total={}", summary.total);
    println!("entries_by_type:");
    for (k, v) in summary.by_type {
        println!(" - {k}: {v}");
    }

    if let Some(id) = sprite_id {
        println!("\n=== lookup sprite-id {id} ===");

        let catalog_entry = assets::sprites::find_sprite_entry(&entries, id)
            .ok_or_else(|| anyhow!("sprite-id {id} not found in catalog"))?;

        assets::catalog::ensure_has_sprite_fields(catalog_entry)?;

        let sprite_path = scan.root.join(&catalog_entry.file);
        let compressed = std::fs::read(&sprite_path)?;
        let bmp_bytes = assets::lzma::decompress_cipsoft_lzma_asset(&compressed)?;

        println!("decompressed_len={}", bmp_bytes.len());
        println!(
            "decompressed_magic={:02x} {:02x}",
            bmp_bytes.get(0).copied().unwrap_or(0),
            bmp_bytes.get(1).copied().unwrap_or(0)
        );

        let info = assets::bmp::parse_bmp_info(&bmp_bytes)?;
        println!("file={}", catalog_entry.file);
        println!(
            "sheet={}x{} bpp={} offset={}",
            info.width, info.height, info.bpp, info.data_offset
        );

        let rect = assets::sprites::sprite_rect_from_sheet(catalog_entry, id, &info)?;
        println!(
            "rect: col={} row={} x={} y={} w={} h={}",
            rect.col, rect.row, rect.x, rect.y, rect.w, rect.h
        );

        // -------- dump PNG (recorta do BMP e salva) --------
        if let Some(out) = dump_path {
            // decode BMP -> RGBA
            let dyn_img = image::load_from_memory_with_format(&bmp_bytes, image::ImageFormat::Bmp)?;
            let rgba = dyn_img.to_rgba8();

            // crop usando o rect que você já calculou (x/y/w/h)
            let cropped =
                image::imageops::crop_imm(&rgba, rect.x, rect.y, rect.w, rect.h).to_image();

            // encode PNG
            let mut png = Vec::new();
            image::DynamicImage::ImageRgba8(cropped)
                .write_to(&mut Cursor::new(&mut png), image::ImageFormat::Png)?;

            // garante diretório
            if let Some(parent) = out.parent() {
                if !parent.as_os_str().is_empty() {
                    std::fs::create_dir_all(parent)?;
                }
            }

            std::fs::write(&out, &png)?;
            println!("dump_png={}", out.display());
            println!("dump_png_len={}", png.len());
        }
    }

    Ok(())
}
