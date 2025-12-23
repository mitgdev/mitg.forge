use rand::Rng;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use tauri::AppHandle;
use tauri::Emitter;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Position {
    x: i32,
    y: i32,
    z: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum Direction {
    North,
    South,
    East,
    West,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MoveRequest {
    request_id: String,
    from: Position,
    direction: Direction,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MoveResultEvent {
    request_id: String,
    ok: bool,
    position: Option<Position>,
    error: Option<String>,
}

fn apply_dir(mut p: Position, dir: Direction) -> Position {
    match dir {
        Direction::North => p.y -= 1,
        Direction::South => p.y += 1,
        Direction::West => p.x -= 1,
        Direction::East => p.x += 1,
    }
    p
}

#[tauri::command]
async fn request_move(app: AppHandle, req: MoveRequest) -> Result<(), String> {
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(Duration::from_millis(30)).await;

        let fail = rand::rng().random_bool(0.03); // 3%
        let ev = if fail {
            MoveResultEvent {
                request_id: req.request_id,
                ok: false,
                position: None,
                error: Some("simulated_error".to_string()),
            }
        } else {
            let new_pos = apply_dir(req.from, req.direction);
            MoveResultEvent {
                request_id: req.request_id,
                ok: true,
                position: Some(new_pos),
                error: None,
            }
        };

        // emite pro front
        let _ = app.emit("move_result", ev);
    });

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![request_move])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
