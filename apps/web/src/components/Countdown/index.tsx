import type React from "react";
import { useCountdown } from "@/sdk/hooks/useCountdown";

type Props = {
	targetDate: Date;
};

export const Countdown: React.FC<Props> = ({ targetDate }) => {
	const { days, hours, minutes, seconds } = useCountdown(targetDate);

	const pad = (n: number) => String(n).padStart(2, "0");

	const showDays = days > 0;

	return (
		<span className="text-secondary">
			{showDays && `${days}d `}
			{pad(hours)}:{pad(minutes)}:{pad(seconds)}
		</span>
	);
};
