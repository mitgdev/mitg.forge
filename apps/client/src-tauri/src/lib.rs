pub mod codec;
pub mod game;
pub mod xtea;

use crate::game::commands::{game_command, game_connect, game_disconnect};
use crate::game::mod_state::GameState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(GameState::new())
        .invoke_handler(tauri::generate_handler![
            game_connect,
            game_disconnect,
            game_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
