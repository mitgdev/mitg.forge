pub mod appearances;
pub mod bmp;
pub mod catalog;
pub mod image;
pub mod lzma;
pub mod protobuf;
pub mod sprites;
pub mod thing_plan;

use std::path::{Path, PathBuf};

use anyhow::{Result, anyhow};

pub fn file_size(path: impl AsRef<Path>) -> Result<u64> {
    let meta = std::fs::metadata(path)?;
    Ok(meta.len())
}

#[derive(Debug)]
pub struct AssetScan {
    pub root: PathBuf,
    pub files: Vec<String>,
    pub has_catalog: bool,
    pub sprites_count: usize,
    pub appearances_count: usize,
}

pub fn scan_assets_dir(root: impl AsRef<Path>) -> Result<AssetScan> {
    let root = root.as_ref().to_path_buf();

    if !root.exists() {
        return Err(anyhow!("assets dir does not exist: {}", root.display()));
    }

    if !root.is_dir() {
        return Err(anyhow!("not a directory: {}", root.display()));
    }

    let mut files: Vec<String> = Vec::new();
    let mut has_catalog = false;
    let mut sprites_count = 0usize;
    let mut appearances_count = 0usize;

    for entry in std::fs::read_dir(&root)? {
        let entry = entry?;
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        let name = path
            .file_name()
            .and_then(|s| s.to_str())
            .unwrap_or("<non-utf8>")
            .to_string();

        if name == "catalog-content.json" {
            has_catalog = true;
        }

        if name.starts_with("sprites-") && name.ends_with(".bmp.lzma") {
            sprites_count += 1;
        }
        if name.starts_with("appearances-") && name.ends_with(".dat") {
            appearances_count += 1;
        }

        files.push(name);
    }

    files.sort();

    Ok(AssetScan {
        root,
        files,
        has_catalog,
        sprites_count,
        appearances_count,
    })
}

pub fn validate_assets(scan: &AssetScan) -> Result<()> {
    if !scan.has_catalog {
        return Err(anyhow!("missing catalog-content.json"));
    }
    if scan.sprites_count == 0 {
        return Err(anyhow!("missing sprites-*.bmp.lzma files"));
    }
    // appearances pode ser opcional dependendo do seu cliente, mas por enquanto vamos exigir.
    if scan.appearances_count == 0 {
        return Err(anyhow!("missing appearances-*.dat files"));
    }
    Ok(())
}
