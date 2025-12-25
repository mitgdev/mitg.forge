use std::time::{Duration, SystemTime, UNIX_EPOCH};

use tauri::{AppHandle, Emitter};
use tokio::{sync::mpsc, time::interval};

use crate::{
    codec::{pack_body, unpack_body},
    game::{
        events,
        types::{CryptoState, GameEvent, MoveDir, MoveResult, Position, UiCommand},
    },
    xtea::{generate_xtea_key_bytes, xtea_decrypt, xtea_encrypt, xtea_key_from_bytes_le},
};

#[derive(Debug)]
pub enum WorkerCommand {
    Stop,
    Ui(UiCommand),
}

#[derive(Debug)]
struct WorkerState {
    crypto: CryptoState,
    player_position: Position,
}

fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
}

fn emit(app: &AppHandle, event: GameEvent) {
    let _ = app.emit(events::GAME_EVENT, event);
}

fn apply_dir(from: Position, dir: MoveDir) -> Position {
    match dir {
        MoveDir::N => Position {
            y: from.y - 1,
            ..from
        },
        MoveDir::S => Position {
            y: from.y + 1,
            ..from
        },
        MoveDir::W => Position {
            x: from.x - 1,
            ..from
        },
        MoveDir::E => Position {
            x: from.x + 1,
            ..from
        },
    }
}

pub async fn run_worker(
    app: AppHandle,
    ip: String,
    port: u16,
    session_key: String,
    character_name: String,
    mut rx: mpsc::Receiver<WorkerCommand>,
) -> anyhow::Result<()> {
    let key_bytes = generate_xtea_key_bytes();

    let mut state = WorkerState {
        crypto: CryptoState {
            xtea_enabled: true,
            xtea_key: Some(xtea_key_from_bytes_le(key_bytes)),
        },
        player_position: Position {
            x: 100,
            y: 100,
            z: 7,
        },
    };

    emit(
        &app,
        GameEvent::State {
            state: "connected".into(),
        },
    );
    emit(
        &app,
        GameEvent::Log {
            level: "info".into(),
            message: format!(
                "worker started (ip={ip} port={port} character={character_name} session_key_len={})",
                session_key.len()
            ),
            ts_ms: now_ms(),
        },
    );
    emit(
        &app,
        GameEvent::Log {
            level: "info".into(),
            message: "Login simulated: XTEA enabled + key stored in worker state".into(),
            ts_ms: now_ms(),
        },
    );
    emit(&app, GameEvent::CryptoState(state.crypto));
    emit(&app, GameEvent::PlayerPosition(state.player_position));
    emit(&app, GameEvent::CryptoState(state.crypto));

    let mut tick = interval(Duration::from_secs(1));
    let mut n: u64 = 0;

    loop {
        tokio::select! {
            _ = tick.tick() => {
                n += 1;
                emit(&app, GameEvent::Tick { n, ts_ms: now_ms() });
            }

            command = rx.recv() => {
                match command {
                    Some(WorkerCommand::Ui(ui)) => {
                        handle_ui_command(&app, ui, &mut state).await;
                    }
                    Some(WorkerCommand::Stop) | None => {
                        emit(&app, GameEvent::Log {
                            level: "warn".into(),
                            message: "worker stopping".into(),
                            ts_ms: now_ms()
                        });
                        emit(&app, GameEvent::State { state: "disconnected".into() });
                        break;
                    }
                }
            }
        }
    }

    Ok(())
}

async fn handle_ui_command(app: &AppHandle, command: UiCommand, state: &mut WorkerState) {
    // ✅ config fake (deixa fixo aqui também)
    let latency_ms: u64 = 30;
    let error_rate: f32 = 0.01; // 1% rollback

    match command {
        UiCommand::SendRaw { payload } => {
            let xtea = state.crypto.xtea_enabled;
            let key = state.crypto.xtea_key;

            let payload_hex = hex::encode(&payload);
            let mut body = pack_body(&payload);

            if xtea {
                let k = key.expect("xtea_enabled but no key has generated");
                xtea_encrypt(&mut body, k);
            }

            emit(
                app,
                GameEvent::RawTx {
                    payload_hex,
                    body_hex: hex::encode(&body),
                    len: body.len(),
                    xtea,
                },
            );

            if xtea {
                let k = key.unwrap();
                xtea_decrypt(&mut body, k);
            }

            let unpacked = unpack_body(&body).unwrap();

            emit(
                app,
                GameEvent::RawRx {
                    payload_hex: hex::encode(&unpacked),
                    len: unpacked.len(),
                    xtea,
                },
            );
        }
        UiCommand::Log { message } => {
            emit(
                app,
                GameEvent::Log {
                    level: "info".into(),
                    message: format!("received UiCommand::Log: {message}"),
                    ts_ms: now_ms(),
                },
            );
        }
        UiCommand::Move(move_command) => {
            tokio::time::sleep(Duration::from_millis(latency_ms)).await;

            let rolled_back = rand::random::<f32>() < error_rate;
            let player_position = state.player_position;

            if rolled_back {
                emit(
                    app,
                    GameEvent::MoveResult(MoveResult {
                        req_id: move_command.req_id,
                        ok: false,
                        position: player_position, // manda a posição autoritativa atual
                        reason: Some("simulated_rollback".into()),
                    }),
                );
            } else {
                state.player_position = apply_dir(player_position, move_command.dir);

                emit(
                    app,
                    GameEvent::MoveResult(MoveResult {
                        req_id: move_command.req_id,
                        ok: true,
                        position: player_position,
                        reason: None,
                    }),
                );
            }
        }
    }
}
