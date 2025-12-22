import { invoke } from "@tauri-apps/api/core";
import { GameStage } from "./game/GameStage";

export default function App() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-black">
			<GameStage />
		</div>
	);
}
