import { Tooltip } from "@/ui/Tooltip";

export const PlayerRewardCollected = ({
	collected = false,
}: {
	collected?: boolean;
}) => {
	return (
		<Tooltip content={collected ? "Reward Collected" : "Reward Not Collected"}>
			{collected ? (
				<img
					alt="reward-collected"
					src="/assets/icons/global/dailyreward-collected.png"
				/>
			) : (
				<img
					alt="reward-collected"
					src="/assets/icons/global/dailyreward-notcollected.png"
				/>
			)}
		</Tooltip>
	);
};
