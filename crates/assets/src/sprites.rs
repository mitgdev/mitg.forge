use anyhow::{Result, anyhow};

use crate::bmp::BmpInfo;
use crate::catalog::{CatalogContent, CatalogEntry};

pub const SPRITE_TILE: u32 = 32;

#[derive(Debug, Clone)]
pub struct SpriteRect {
    pub file: String,
    pub sprite_id: u32,
    pub sheet_w: u32,
    pub sheet_h: u32,
    pub col: u32,
    pub row: u32,
    pub x: u32,
    pub y: u32,
    pub w: u32,
    pub h: u32,
}

pub fn find_sprite_entry<'a>(
    entries: &'a CatalogContent,
    sprite_id: u32,
) -> Option<&'a CatalogEntry> {
    entries.iter().find(|e| {
        if e.kind != "sprite" {
            return false;
        }
        match (e.first_sprite_id, e.last_sprite_id) {
            (Some(first), Some(last)) => sprite_id >= first && sprite_id <= last,
            _ => false,
        }
    })
}

pub fn sprite_rect_from_sheet(
    entry: &CatalogEntry,
    sprite_id: u32,
    bmp: &BmpInfo,
) -> Result<SpriteRect> {
    let first = entry
        .first_sprite_id
        .ok_or_else(|| anyhow!("missing first_sprite_id"))?;
    let last = entry
        .last_sprite_id
        .ok_or_else(|| anyhow!("missing last_sprite_id"))?;
    if sprite_id < first || sprite_id > last {
        return Err(anyhow!("sprite_id out of entry range"));
    }

    let cols = bmp.width / SPRITE_TILE;
    if cols == 0 {
        return Err(anyhow!("sheet width too small: {}", bmp.width));
    }

    let index = sprite_id - first;
    let col = index % cols;
    let row = index / cols;

    let x = col * SPRITE_TILE;
    let y = row * SPRITE_TILE;

    if x + SPRITE_TILE > bmp.width || y + SPRITE_TILE > bmp.height {
        return Err(anyhow!("computed rect out of bounds"));
    }

    Ok(SpriteRect {
        file: entry.file.clone(),
        sprite_id,
        sheet_w: bmp.width,
        sheet_h: bmp.height,
        col,
        row,
        x,
        y,
        w: SPRITE_TILE,
        h: SPRITE_TILE,
    })
}
