import { useEffect, useRef, useState } from "react";

export function useContainerSize<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!ref.current) return;

		const el = ref.current;

		function update() {
			const rect = el.getBoundingClientRect();
			setSize({ width: rect.width, height: rect.height });
		}

		update();

		const observer = new ResizeObserver(() => update());
		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return { ref, size };
}
