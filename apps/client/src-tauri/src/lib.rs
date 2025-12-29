pub mod codec;
pub mod game;
pub mod states;
pub mod xtea;

use tauri::Manager;

use crate::game::commands::{game_command, game_connect, game_disconnect};
use crate::game::mod_state::GameState;
use crate::states::mi_protocol;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let state = mi_protocol::AssetsState::init(app.handle())?;
            app.manage(state);

            Ok(())
        })
        .register_asynchronous_uri_scheme_protocol("miforge", |ctx, request, responder| {
            let app = ctx.app_handle().clone();
            tauri::async_runtime::spawn(async move {
                let response = mi_protocol::handle(&app, request);
                let _ = responder.respond(response);
            });
        })
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
