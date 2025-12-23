import { Profiler, type ReactNode, useEffect } from "react";
import { useDevtoolsStore } from "@/sdk/store/devtools";

export function ReactPerfProfiler({ children }: { children: ReactNode }) {
	const enabled = useDevtoolsStore((s) => s.enabled);
	const note = useDevtoolsStore((s) => s.noteReactCommit);
	const tick = useDevtoolsStore((s) => s.tickReactWindow);

	useEffect(() => {
		if (!enabled) return;
		const id = window.setInterval(() => tick(), 1000);
		return () => window.clearInterval(id);
	}, [enabled, tick]);

	return (
		<Profiler
			id="app"
			onRender={(_id, _phase, actualDuration) => {
				if (!enabled) return;
				note(actualDuration);
			}}
		>
			{children}
		</Profiler>
	);
}
