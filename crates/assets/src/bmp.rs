use anyhow::{Result, anyhow};

#[derive(Debug, Clone)]
pub struct BmpInfo {
    pub width: u32,
    pub height: u32,
    pub bpp: u16,
    pub data_offset: u32,
}

pub fn parse_bmp_info(bytes: &[u8]) -> Result<BmpInfo> {
    if bytes.len() < 54 {
        return Err(anyhow!("bmp too small"));
    }
    if &bytes[0..2] != b"BM" {
        return Err(anyhow!("not a BMP (missing BM header)"));
    }

    let data_offset = u32::from_le_bytes(bytes[10..14].try_into().unwrap());
    let dib_header_size = u32::from_le_bytes(bytes[14..18].try_into().unwrap());

    if dib_header_size < 40 {
        return Err(anyhow!("unsupported DIB header size: {dib_header_size}"));
    }

    let width = i32::from_le_bytes(bytes[18..22].try_into().unwrap());
    let height = i32::from_le_bytes(bytes[22..26].try_into().unwrap());
    let bpp = u16::from_le_bytes(bytes[28..30].try_into().unwrap());

    if width <= 0 || height == 0 {
        return Err(anyhow!("invalid bmp dims: {width}x{height}"));
    }

    Ok(BmpInfo {
        width: width as u32,
        height: height.unsigned_abs(), // BMP pode ser top-down se height negativo
        bpp,
        data_offset,
    })
}
