import { useEffect, useMemo, useState } from "react";

export function useOutfitAnimation(
	frames: Array<{ image: string; duration: number }>,
	{ autoPlay = true, loop = true }: { autoPlay?: boolean; loop?: boolean } = {},
) {
	const [currentFrame, setCurrentFrame] = useState(0);

	const framesKey = useMemo(() => {
		if (frames.length === 0) return "empty";
		const first = frames[0]?.image ?? "";
		const last = frames[frames.length - 1]?.image ?? "";
		let total = 0;
		for (const f of frames) total += f.duration || 0;
		return `${frames.length}|${first}|${last}|${total}`;
	}, [frames]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <need to change when framesKey changes>
	useEffect(() => {
		setCurrentFrame(0);
	}, [framesKey]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <need to change when framesKey changes>
	useEffect(() => {
		if (!autoPlay || frames.length === 0) return;

		const current = frames[currentFrame];
		if (!current) return;

		const timeout = setTimeout(() => {
			setCurrentFrame((prev) => {
				const next = prev + 1;
				if (next < frames.length) return next;
				return loop ? 0 : prev;
			});
		}, current.duration);

		return () => clearTimeout(timeout);
	}, [autoPlay, loop, framesKey, frames, currentFrame]);

	return {
		currentFrame,
		frame: frames[currentFrame],
		isLast: currentFrame === frames.length - 1,
		goTo: (i: number) =>
			setCurrentFrame((prev) => (i >= 0 && i < frames.length ? i : prev)),
	};
}
