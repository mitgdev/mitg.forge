import { useMovementStore } from "@/sdk/store/movement";
import type { MoveDir } from "../types/movement";

function isTypingInInput() {
	const el = document.activeElement as HTMLElement | null;
	if (!el) return false;
	const tag = el.tagName.toLowerCase();
	return tag === "input" || tag === "textarea" || el.isContentEditable;
}

function keyToDir(key: string): MoveDir | null {
	if (key === "ArrowUp" || key === "w" || key === "W") return "N";
	if (key === "ArrowDown" || key === "s" || key === "S") return "S";
	if (key === "ArrowLeft" || key === "a" || key === "A") return "W";
	if (key === "ArrowRight" || key === "d" || key === "D") return "E";
	return null;
}

export function startMovementInput() {
	const onKeyDown = (e: KeyboardEvent) => {
		if (isTypingInInput()) return;
		const dir = keyToDir(e.key);
		if (!dir) return;
		e.preventDefault();
		useMovementStore.getState().enqueueMove(dir);
	};

	window.addEventListener("keydown", onKeyDown, { passive: false });

	return () => window.removeEventListener("keydown", onKeyDown);
}
