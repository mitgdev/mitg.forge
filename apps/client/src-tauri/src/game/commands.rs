use tauri::{AppHandle, State};
use tokio::sync::mpsc;

use crate::game::{
    mod_state::{GameHandle, GameState},
    types::UiCommand,
    worker::{run_worker, WorkerCommand},
};

#[tauri::command]
pub async fn game_connect(
    app: AppHandle,
    state: State<'_, GameState>,
    ip: String,
    port: u16,
    session_key: String,
    character_name: String,
) -> Result<(), String> {
    let mut guard = state.handle.lock().await;

    if guard.is_some() {
        return Err("already connected".into());
    }

    let (tx, rx) = mpsc::channel::<WorkerCommand>(256);

    tokio::spawn(async move {
        if let Err(e) = run_worker(app, ip, port, session_key, character_name, rx).await {
            eprintln!("worker error: {e:?}")
        }
    });

    *guard = Some(GameHandle { tx });

    Ok(())
}

#[tauri::command]
pub async fn game_disconnect(state: State<'_, GameState>) -> Result<(), String> {
    let mut guard = state.handle.lock().await;

    if let Some(game_handle) = guard.take() {
        let _ = game_handle.tx.send(WorkerCommand::Stop).await;
    }

    Ok(())
}

#[tauri::command]
pub async fn game_command(state: State<'_, GameState>, command: UiCommand) -> Result<(), String> {
    let guard = state.handle.lock().await;
    let game_handle = guard.as_ref().ok_or("not connected")?;

    game_handle
        .tx
        .send(WorkerCommand::Ui(command))
        .await
        .map_err(|_| "send failed".to_string())?;

    Ok(())
}
