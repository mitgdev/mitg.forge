use rand::RngCore;
use rand_core::OsRng;

const XTEA_DELTA: u32 = 0x9E37_79B9;
const XTEA_ROUNDS: usize = 32;

pub fn generate_xtea_key_bytes() -> [u8; 16] {
    let mut raw = [0u8; 16];
    OsRng.fill_bytes(&mut raw);
    raw
}

pub fn xtea_key_from_bytes_le(raw: [u8; 16]) -> [u32; 4] {
    [
        u32::from_le_bytes(raw[0..4].try_into().unwrap()),
        u32::from_le_bytes(raw[4..8].try_into().unwrap()),
        u32::from_le_bytes(raw[8..12].try_into().unwrap()),
        u32::from_le_bytes(raw[12..16].try_into().unwrap()),
    ]
}

/**
 * Cria uma cifra com tamanho que seja múltiplo de 8
 */

pub fn xtea_encrypt(buffer: &mut [u8], key: [u32; 4]) {
    assert!(buffer.len() % 8 == 0, "buffer must be multiple of 8");

    for chunk in buffer.chunks_exact_mut(8) {
        let mut v0 = u32::from_le_bytes(chunk[0..4].try_into().unwrap());
        let mut v1 = u32::from_le_bytes(chunk[4..8].try_into().unwrap());

        let mut sum: u32 = 0;

        for _ in 0..XTEA_ROUNDS {
            v0 = v0.wrapping_add(
                (((v1 << 4) ^ (v1 >> 5)).wrapping_add(v1))
                    ^ (sum.wrapping_add(key[(sum & 3) as usize])),
            );

            sum = sum.wrapping_add(XTEA_DELTA);
            v1 = v1.wrapping_add(
                (((v0 << 4) ^ (v0 >> 5)).wrapping_add(v0))
                    ^ (sum.wrapping_add(key[((sum >> 11) & 3) as usize])),
            );
        }

        chunk[0..4].copy_from_slice(&v0.to_le_bytes());
        chunk[4..8].copy_from_slice(&v1.to_le_bytes());
    }
}

/**
 * Faz o decrypt usando uma chave.
 */
pub fn xtea_decrypt(buffer: &mut [u8], key: [u32; 4]) {
    assert!(buffer.len() % 8 == 0, "buf must be multiple of 8");

    for chunk in buffer.chunks_exact_mut(8) {
        let mut v0 = u32::from_le_bytes(chunk[0..4].try_into().unwrap());
        let mut v1 = u32::from_le_bytes(chunk[4..8].try_into().unwrap());

        let mut sum: u32 = XTEA_DELTA.wrapping_mul(XTEA_ROUNDS as u32);
        for _ in 0..XTEA_ROUNDS {
            v1 = v1.wrapping_sub(
                (((v0 << 4) ^ (v0 >> 5)).wrapping_add(v0))
                    ^ (sum.wrapping_add(key[((sum >> 11) & 3) as usize])),
            );
            sum = sum.wrapping_sub(XTEA_DELTA);
            v0 = v0.wrapping_sub(
                (((v1 << 4) ^ (v1 >> 5)).wrapping_add(v1))
                    ^ (sum.wrapping_add(key[(sum & 3) as usize])),
            );
        }

        chunk[0..4].copy_from_slice(&v0.to_le_bytes());
        chunk[4..8].copy_from_slice(&v1.to_le_bytes());
    }
}
