pub fn pack_body(payload: &[u8]) -> Vec<u8> {
    let mut body = Vec::with_capacity(1 + payload.len() + 8);
    body.push(0); // padByte placeholder
    body.extend_from_slice(payload);

    let pad = (8 - (body.len() % 8)) % 8;
    body[0] = pad as u8;
    body.extend(std::iter::repeat(0u8).take(pad));
    body
}

pub fn unpack_body(body: &[u8]) -> Option<Vec<u8>> {
    if body.is_empty() {
        return None;
    }
    let pad = body[0] as usize;
    if pad + 1 > body.len() {
        return None;
    }
    let end = body.len().checked_sub(pad)?;
    Some(body[1..end].to_vec())
}
