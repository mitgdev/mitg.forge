import { Profiler, type ReactNode } from "react";
import { usePerfStore } from "@/sdk/store/performance";

export function ReactPerfProfiler({
	id,
	children,
}: {
	id: string;
	children: ReactNode;
}) {
	const push = usePerfStore((s) => s.pushReactCommit);

	return (
		<Profiler
			id={id}
			onRender={(
				_id,
				_phase,
				actualDuration,
				_baseDuration,
				_startTime,
				commitTime,
			) => {
				push(actualDuration, commitTime);
			}}
		>
			{children}
		</Profiler>
	);
}
