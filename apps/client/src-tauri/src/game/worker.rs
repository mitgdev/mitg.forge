use std::time::{Duration, SystemTime, UNIX_EPOCH};

use tauri::{AppHandle, Emitter};
use tokio::{sync::mpsc, time::interval};

use crate::game::{
    events,
    types::{GameEvent, MoveDir, MoveResult, Position, UiCommand},
};

#[derive(Debug)]
pub enum WorkerCommand {
    Stop,
    Ui(UiCommand),
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

    // ✅ estado autoritativo do "server fake" vive aqui
    let mut player_pos = Position {
        x: 100,
        y: 100,
        z: 7,
    };

    emit(&app, GameEvent::PlayerPosition(player_pos));

    // ✅ config fake (deixa fixo aqui também)
    let latency_ms: u64 = 30;
    let error_rate: f32 = 0.01; // 1% rollback

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
                        handle_ui_command(&app, ui, &mut player_pos, latency_ms, error_rate).await;
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

async fn handle_ui_command(
    app: &AppHandle,
    command: UiCommand,
    player_pos: &mut Position,
    latency_ms: u64,
    error_rate: f32,
) {
    match command {
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

            if rolled_back {
                emit(
                    app,
                    GameEvent::MoveResult(MoveResult {
                        req_id: move_command.req_id,
                        ok: false,
                        position: *player_pos, // manda a posição autoritativa atual
                        reason: Some("simulated_rollback".into()),
                    }),
                );
            } else {
                *player_pos = apply_dir(*player_pos, move_command.dir);

                emit(
                    app,
                    GameEvent::MoveResult(MoveResult {
                        req_id: move_command.req_id,
                        ok: true,
                        position: *player_pos,
                        reason: None,
                    }),
                );
            }
        }
    }
}
