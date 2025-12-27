use anyhow::{Result, anyhow};
use image::{DynamicImage, ImageFormat};
use std::io::Cursor;

pub fn extract_sprite_png_from_sheet(
    sheet_bmp_bytes: &[u8],
    sprite_id: u32,
    first_sprite_id: u32,
    tile_w: u32,
    tile_h: u32,
) -> Result<Vec<u8>> {
    let dyn_img = image::load_from_memory_with_format(sheet_bmp_bytes, ImageFormat::Bmp)?;
    let rgba = dyn_img.to_rgba8();
    let (w, h) = rgba.dimensions();

    if w % tile_w != 0 || h % tile_h != 0 {
        return Err(anyhow!("sheet dims not divisible by tile size"));
    }
    let cols = w / tile_w;
    let rows = h / tile_h;

    let idx = sprite_id
        .checked_sub(first_sprite_id)
        .ok_or_else(|| anyhow!("sprite_id < first_sprite_id"))?;

    let max = cols * rows;
    if idx >= max {
        return Err(anyhow!("sprite index out of sheet range"));
    }

    let col = idx % cols;
    let row = idx / cols;

    let x = col * tile_w;
    let y = row * tile_h;

    let cropped = image::imageops::crop_imm(&rgba, x, y, tile_w, tile_h).to_image();
    let mut out = Vec::new();
    DynamicImage::ImageRgba8(cropped).write_to(&mut Cursor::new(&mut out), ImageFormat::Png)?;
    Ok(out)
}
