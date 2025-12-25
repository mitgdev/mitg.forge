pub mod commands;
pub mod events;
pub mod types;
pub mod worker;

pub mod mod_state {
    use tokio::sync::{mpsc, Mutex};

    use crate::game::worker::WorkerCommand;

    pub struct GameState {
        pub handle: Mutex<Option<GameHandle>>,
    }

    pub struct GameHandle {
        pub tx: mpsc::Sender<WorkerCommand>,
    }

    impl GameState {
        pub fn new() -> Self {
            Self {
                handle: Mutex::new(None),
            }
        }
    }
}
