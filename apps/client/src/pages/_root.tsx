import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GamePage } from "./game";

export default function RootPage() {
	return (
		<DndProvider backend={HTML5Backend}>
			<GamePage />
		</DndProvider>
	);
}
