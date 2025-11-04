import { Tooltip } from "@/ui/Tooltip";

export const PlayerStatusHidden = () => {
	return (
		<Tooltip content="Status Hidden">
			<img
				alt="status-hidden"
				src="/assets/icons/global/status-hidden.png"
				width={11}
				height={11}
			/>
		</Tooltip>
	);
};
