use anyhow::{Context, Result};
use prost::Message;
use std::path::Path;

use crate::protobuf::{Appearance, Appearances};

pub enum AppearanceKind {
    Object,
    Outfit,
    Effect,
    Missile,
}

pub fn find_by_id<'a>(a: &'a Appearances, kind: AppearanceKind, id: u32) -> Option<&'a Appearance> {
    let list = match kind {
        AppearanceKind::Object => &a.object,
        AppearanceKind::Outfit => &a.outfit,
        AppearanceKind::Effect => &a.effect,
        AppearanceKind::Missile => &a.missile,
    };

    list.iter().find(|x| x.id.unwrap_or(0) == id)
}

pub fn load_appearances_dat(path: impl AsRef<Path>) -> Result<Appearances> {
    let path = path.as_ref();
    let data = std::fs::read(path)
        .with_context(|| format!("failed to read appearances file: {}", path.display()))?;

    // 1) tenta direto
    if let Ok(app) = Appearances::decode(&data[..]) {
        return Ok(app);
    }

    // 2) fallback
    let decompressed = crate::lzma::decompress(&data)
        .context("failed to decompress appearances (lzma/xz fallback)")?;

    let app = Appearances::decode(&decompressed[..])
        .context("failed to decode appearances after decompress")?;

    Ok(app)
}

#[derive(Debug)]
pub struct AppearanceStats {
    pub object_last_id: u32,
    pub outfit_last_id: u32,
    pub effect_last_id: u32,
    pub missile_last_id: u32,
    pub objects: usize,
    pub outfits: usize,
    pub effects: usize,
    pub missiles: usize,
}

pub fn stats(a: &Appearances) -> AppearanceStats {
    AppearanceStats {
        object_last_id: a.object.last().and_then(|x| x.id).unwrap_or(0),
        outfit_last_id: a.outfit.last().and_then(|x| x.id).unwrap_or(0),
        effect_last_id: a.effect.last().and_then(|x| x.id).unwrap_or(0),
        missile_last_id: a.missile.last().and_then(|x| x.id).unwrap_or(0),
        objects: a.object.len(),
        outfits: a.outfit.len(),
        effects: a.effect.len(),
        missiles: a.missile.len(),
    }
}
