import { useEffect, useMemo, useState } from "react";

type Countdown = {
	totalMs: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isExpired: boolean;
};

export function useCountdown(targetDate: Date): Countdown {
	const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

	const [remaining, setRemaining] = useState(() => target - Date.now());

	useEffect(() => {
		if (!target) return;

		const interval = setInterval(() => {
			setRemaining(target - Date.now());
		}, 1000);

		return () => clearInterval(interval);
	}, [target]);

	const totalMs = Math.max(remaining, 0);

	const totalSeconds = Math.floor(totalMs / 1000);
	const seconds = totalSeconds % 60;
	const totalMinutes = Math.floor(totalSeconds / 60);
	const minutes = totalMinutes % 60;
	const totalHours = Math.floor(totalMinutes / 60);
	const hours = totalHours % 24;
	const days = Math.floor(totalHours / 24);

	const isExpired = remaining <= 0;

	return { totalMs, days, hours, minutes, seconds, isExpired };
}
