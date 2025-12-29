use std::collections::BTreeMap;
use std::path::Path;

use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CatalogEntry {
    #[serde(rename = "type")]
    pub kind: String,

    pub file: String,

    // sprite sheets (só existe quando kind == "sprite")
    #[serde(rename = "firstspriteid")]
    pub first_sprite_id: Option<u32>,
    #[serde(rename = "lastspriteid")]
    pub last_sprite_id: Option<u32>,
    #[serde(rename = "spritetype")]
    pub sprite_type: Option<u8>,
}

pub type CatalogContent = Vec<CatalogEntry>;

#[derive(Debug)]
pub struct CatalogSummary {
    pub total: usize,
    pub by_type: BTreeMap<String, usize>,
    pub first_sprite: Option<CatalogEntry>,
}

pub fn load_catalog(path: impl AsRef<Path>) -> Result<CatalogContent> {
    let txt = std::fs::read_to_string(path)?;
    let catalog: CatalogContent = serde_json::from_str(&txt)?;
    Ok(catalog)
}

pub fn summarize(entries: &CatalogContent) -> CatalogSummary {
    let mut by_type: BTreeMap<String, usize> = BTreeMap::new();

    for e in entries {
        *by_type.entry(e.kind.clone()).or_insert(0) += 1;
    }

    let first_sprite = entries.iter().find(|e| e.kind == "sprite").cloned();

    CatalogSummary {
        total: entries.len(),
        by_type,
        first_sprite,
    }
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

pub fn ensure_has_sprite_fields(e: &CatalogEntry) -> Result<()> {
    if e.kind != "sprite" {
        return Err(anyhow!("entry is not sprite"));
    }
    if e.first_sprite_id.is_none() || e.last_sprite_id.is_none() || e.sprite_type.is_none() {
        return Err(anyhow!("sprite entry missing required fields"));
    }
    Ok(())
}
