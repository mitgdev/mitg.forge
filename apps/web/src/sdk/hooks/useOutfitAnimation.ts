import { useEffect, useState } from "react";

export function useOutfitAnimation(
	frames: Array<{ image: string; duration: number }>,
	{ autoPlay = true, loop = true }: { autoPlay?: boolean; loop?: boolean } = {},
) {
	const [currentFrame, setCurrentFrame] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <always reset if frames change>
	useEffect(() => {
		setCurrentFrame(0);
	}, [frames]);

	useEffect(() => {
		if (!autoPlay || frames.length === 0) return;

		const current = frames[currentFrame];

		const timeout = setTimeout(() => {
			setCurrentFrame((prev) => {
				const next = prev + 1;
				if (next < frames.length) return next;
				return loop ? 0 : prev; // se não for loop, fica no último
			});
		}, current.duration);

		return () => clearTimeout(timeout);
	}, [autoPlay, loop, frames, currentFrame]);

	return {
		currentFrame,
		frame: frames[currentFrame],
		isLast: currentFrame === frames.length - 1,
		goTo: (i: number) =>
			setCurrentFrame((prev) => (i >= 0 && i < frames.length ? i : prev)),
	};
}
