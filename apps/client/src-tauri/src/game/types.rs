use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Position {
    pub x: i32,
    pub y: i32,
    pub z: i32,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum MoveDir {
    N,
    S,
    W,
    E,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CryptoState {
    pub xtea_enabled: bool,
    pub xtea_key: Option<[u32; 4]>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MoveCommand {
    pub req_id: String,
    pub from: Position,
    pub dir: MoveDir,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MoveResult {
    pub req_id: String,
    pub ok: bool,
    pub position: Position,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum UiCommand {
    Log { message: String },
    Move(MoveCommand),
    SendRaw { payload: Vec<u8> },
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type", content = "data")]
pub enum GameEvent {
    State {
        state: String,
    },
    Log {
        level: String,
        message: String,
        ts_ms: u128,
    },
    Tick {
        n: u64,
        ts_ms: u128,
    },
    MoveResult(MoveResult),
    PlayerPosition(Position),
    CryptoState(CryptoState),
    RawTx {
        payload_hex: String,
        body_hex: String,
        len: usize,
        xtea: bool,
    },
    RawRx {
        payload_hex: String,
        len: usize,
        xtea: bool,
    },
}
