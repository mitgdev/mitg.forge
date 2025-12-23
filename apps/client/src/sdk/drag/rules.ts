import type { DragPayload, DragPreview, DropTarget } from "./types";

type NonNullTarget = Exclude<DropTarget, null>;

export type Rule = {
	kind: DragPayload["kind"];
	zone: NonNullTarget["zone"];
	canDrop?: (payload: DragPayload, target: NonNullTarget) => boolean;
	onHover?: (payload: DragPayload, target: NonNullTarget) => void;
	onDrop: (payload: DragPayload, target: NonNullTarget) => void;

	getPreview?: (payload: DragPayload) => DragPreview;
};

const rules: Rule[] = [];

export function registerRule(rule: Rule) {
	rules.push(rule);
}

export function resolveRule(payload: DragPayload, target: NonNullTarget) {
	const candidates = rules.filter(
		(r) => r.kind === payload.kind && r.zone === target.zone,
	);
	for (const r of candidates) {
		const ok = r.canDrop ? r.canDrop(payload, target) : true;
		if (ok) return { rule: r, canDrop: true };
	}
	// se existe rule mas canDrop falhou, ainda queremos saber "não pode"
	if (candidates.length) return { rule: null, canDrop: false };
	return { rule: null, canDrop: false };
}
