import "./global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { startMovementSystem } from "./game/movementSystem";

startMovementSystem();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
