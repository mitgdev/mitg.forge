use std::{io::Cursor, path::PathBuf};

use anyhow::{Result, anyhow};
use assets::{appearances::load_appearances_dat, thing_plan::build_object_render_plan};

/**
* Sanguine Blade
* cargo run -p assets --bin object_plan_inspect -- \
  apps/client/src-tauri/resources/assets/appearances-5997985a63a3e937581971c125efd546c0dfd0623341744ea8fa481c7fc9a560.dat \
  --id 43864
*/

fn main() -> Result<()> {
    let mut args = std::env::args().skip(1);

    let appearances_path = args
        .next()
        .ok_or_else(|| anyhow!("usage: object_plan_inspect <appearances.dat> --id <object_id>"))?;

    let mut id: Option<u32> = None;

    while let Some(a) = args.next() {
        match a.as_str() {
            "--id" => {
                let value = args
                    .next()
                    .ok_or_else(|| anyhow!("--id requires a number"))?;
                id = Some(value.parse::<u32>()?);
            }
            other => return Err(anyhow!("unknown arg: {other}")),
        }
    }

    let id = id.ok_or_else(|| anyhow!("missing --id"))?;

    let appearances = load_appearances_dat(&appearances_path)?;
    let plan = build_object_render_plan(&appearances, id)?;

    println!("{}", serde_json::to_string_pretty(&plan)?);

    let scan = assets::scan_assets_dir("apps/client/src-tauri/resources/assets")?;

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

    let all_sprites_ids: Vec<u32> = plan
        .frames
        .iter()
        .flat_map(|frame| frame.sprite_ids.iter().copied())
        .collect();

    for sprite_id in all_sprites_ids.iter() {
        println!("\n === lookup sprite_id:{sprite_id} ===");

        let catalog_entry = assets::sprites::find_sprite_entry(&entries, *sprite_id)
            .ok_or_else(|| anyhow!("sprite_id:{sprite_id} not found in catalog"))?;

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
        println!("{}", serde_json::to_string_pretty(&catalog_entry)?);

        let info = assets::bmp::parse_bmp_info(&bmp_bytes)?;
        println!("file={}", catalog_entry.file);
        println!(
            "sheet={}x{} bpp={} offset={}",
            info.width, info.height, info.bpp, info.data_offset
        );

        let rect = assets::sprites::sprite_rect_from_sheet(catalog_entry, *sprite_id, &info)?;
        println!(
            "rect: col={} row={} x={} y={} w={} h={}",
            rect.col, rect.row, rect.x, rect.y, rect.w, rect.h
        );

        let dynamic_image =
            image::load_from_memory_with_format(&bmp_bytes, image::ImageFormat::Bmp)?;
        let rgba = dynamic_image.to_rgba8();

        let cropped_image =
            image::imageops::crop_imm(&rgba, rect.x, rect.y, rect.w, rect.h).to_image();

        let mut png = Vec::new();
        image::DynamicImage::ImageRgba8(cropped_image)
            .write_to(&mut Cursor::new(&mut png), image::ImageFormat::Png)?;

        let out_dir = PathBuf::from("out");
        std::fs::create_dir_all(&out_dir)?;

        let out_path = out_dir.join(format!("sprite_{sprite_id}.png"));

        std::fs::write(&out_path, &png)?;
        println!("dump_png={}", out_path.display());
        println!("dump_png_len={}", png.len());
    }

    Ok(())
}
