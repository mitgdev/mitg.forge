import type { Coins } from "@miforge/api/shared/utils/coins";
import { useMemo } from "react";
import { Tooltip } from "@/ui/Tooltip";

type Props = {
	type: Coins | "reserved";
	amount: number;
};

export const TibiaCoins = ({ type, amount = 0 }: Props) => {
	const { icon, message } = useMemo(() => {
		switch (type) {
			case "reserved":
				return {
					icon: "/assets/icons/global/icon-tibiacointrusted.png",
					message: "Reserved coins",
				};
			case "transferable":
				return {
					icon: "/assets/icons/global/icon-tibiacointrusted.png",
					message: "Transferable coins",
				};
			case "non-transferable":
				return {
					icon: "/assets/icons/global/icon-tibiacoin.png",
					message: "Non-transferable coins",
				};
			default:
				return {
					icon: "/assets/icons/global/icon-tibiacoin.png",
					message: "Tibia coins",
				};
		}
	}, [type]);

	return (
		<div className="flex flex-row items-center gap-0.5 font-verdana text-secondary text-sm">
			{amount}
			<Tooltip content={message}>
				<img alt="tibia coins" src={icon} width={12} height={12} />
			</Tooltip>
		</div>
	);
};
