use anyhow::{Result, anyhow};
use std::io::{self, BufRead, BufReader, Cursor, Read};
use xz2::read::XzDecoder;

fn starts_with_cip_header(data: &[u8]) -> bool {
    // padrão comum: 0x70 0x0A 0xFA 0x80 0x24
    data.len() >= 5
        && data[0] == 0x70
        && data[1] == 0x0A
        && data[2] == 0xFA
        && data[3] == 0x80
        && data[4] == 0x24
}

/// Lazily patches Tibia's incorrect LZMA header without cloning the payload.
struct HeaderPatcher<'a> {
    data: &'a [u8],
    pos: usize,
}

impl<'a> HeaderPatcher<'a> {
    #[inline]
    fn new(data: &'a [u8]) -> Self {
        Self { data, pos: 0 }
    }
}

impl<'a> Read for HeaderPatcher<'a> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        if self.pos >= self.data.len() || buf.is_empty() {
            return Ok(0);
        }

        let remaining = &self.data[self.pos..];
        let len = remaining.len().min(buf.len());
        buf[..len].copy_from_slice(&remaining[..len]);

        // Tibia LZMA header patch: overwrite bytes 5..13 with 0xFF
        if self.data.len() >= 13 && self.pos < 13 && self.pos + len > 5 {
            let start = self.pos.max(5);
            let end = (self.pos + len).min(13);
            for idx in start..end {
                buf[idx - self.pos] = 0xFF;
            }
        }

        self.pos += len;
        Ok(len)
    }
}

#[inline]
fn try_lzma<R: BufRead>(
    reader: R,
    output: &mut Vec<u8>,
) -> std::result::Result<(), lzma_rs::error::Error> {
    let mut reader = reader;
    output.clear();
    match lzma_rs::lzma_decompress(&mut reader, output) {
        Ok(()) => Ok(()),
        Err(err) => {
            output.clear();
            Err(err)
        }
    }
}

/// Decompress LZMA data (Tibia uses a custom LZMA format)
pub fn decompress(data: &[u8]) -> Result<Vec<u8>> {
    anyhow::ensure!(data.len() >= 13, "LZMA data too short");

    let mut decompressed = Vec::new();
    let mut errors = Vec::with_capacity(3);

    match try_lzma(BufReader::new(HeaderPatcher::new(data)), &mut decompressed) {
        Ok(()) => return Ok(decompressed),
        Err(err) => errors.push(format!("lzma-rs with corrected header: {err}")),
    }

    match try_lzma(Cursor::new(data), &mut decompressed) {
        Ok(()) => return Ok(decompressed),
        Err(err) => errors.push(format!("lzma-rs with original header: {err}")),
    }

    decompressed.clear();
    match XzDecoder::new(Cursor::new(data)).read_to_end(&mut decompressed) {
        Ok(_) => Ok(decompressed),
        Err(err) => {
            errors.push(format!("xz2 fallback: {err}"));
            Err(anyhow::anyhow!(
                "Failed to decompress LZMA data ({})",
                errors.join("; ")
            ))
        }
    }
}

/// Decompress de arquivos Tibia *.bmp.lzma / *.dat (CipSoft wrapper + LZMA stream).
/// - pula padding zero
/// - pula header CIP (5 bytes) se existir
/// - pula "7-bit encoded size" se existir
/// - então chama `decompress()` no stream LZMA real
pub fn decompress_cipsoft_lzma_asset(data: &[u8]) -> Result<Vec<u8>> {
    if data.len() < 16 {
        return Err(anyhow!("asset file too small"));
    }

    // 0) alguns arquivos podem já estar “crus” (raros), se já começa com BMP:
    if data.len() >= 2 && &data[0..2] == b"BM" {
        return Ok(data.to_vec());
    }

    // 1) skip leading zeros (padding)
    let mut offset = 0usize;
    while offset < data.len() && data[offset] == 0 {
        offset += 1;
    }
    if offset >= data.len() {
        return Err(anyhow!("asset contains only zeros"));
    }

    // 2) tenta pular header CIP (5 bytes) apenas se bater o padrão
    if offset + 5 <= data.len() && starts_with_cip_header(&data[offset..]) {
        offset += 5;

        // 3) pula “7-bit encoded size” - a gente não precisa do valor
        while offset < data.len() {
            let b = data[offset];
            offset += 1;
            if (b & 0x80) == 0 {
                break;
            }
        }
        if offset >= data.len() {
            return Err(anyhow!("incomplete cip header"));
        }

        // 4) agora sim: stream LZMA começa aqui
        let lzma_stream = &data[offset..];
        if lzma_stream.len() < 13 {
            return Err(anyhow!("lzma stream too short after cip header"));
        }

        // usa seu decompress(LZMA puro)
        if let Ok(v) = decompress(lzma_stream) {
            return Ok(v);
        }

        // fallback: tenta descomprimir o arquivo inteiro (caso esse asset não siga o padrão)
        return decompress(data).map_err(|e| anyhow!("failed to decompress asset: {e}"));
    }

    // 5) se não tem header CIP, tenta como LZMA puro do começo (ou XZ fallback)
    decompress(data)
}
