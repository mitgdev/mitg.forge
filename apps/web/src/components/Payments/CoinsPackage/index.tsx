import { ServiceItem, type ServiceItemProps } from "../ServiceItem";

type PackageSize = "tiny" | "small" | "medium" | "large" | "xlarge" | "mega";

const PACKAGE_META: Record<PackageSize, { label: string; icon: string }> = {
	tiny: {
		label: "Tiny",
		icon: "/assets/payments/coins/serviceid_1.png",
	},
	small: {
		label: "Small",
		icon: "/assets/payments/coins/serviceid_2.png",
	},
	medium: {
		label: "Medium",
		icon: "/assets/payments/coins/serviceid_3.png",
	},
	large: {
		label: "Large",
		icon: "/assets/payments/coins/serviceid_4.png",
	},
	xlarge: {
		label: "X-Large",
		icon: "/assets/payments/coins/serviceid_5.png",
	},
	mega: {
		label: "Mega",
		icon: "/assets/payments/coins/serviceid_6.png",
	},
};

type Props = Omit<ServiceItemProps, "title"> & {
	amount: number;
	size?: PackageSize;
};

export const CoinsPackageItem = ({
	size = "mega",
	amount = 0,
	onClick,
	price,
	selected,
	disabled = false,
}: Props) => {
	const icon = PACKAGE_META[size].icon;

	return (
		<ServiceItem
			onClick={onClick}
			title={`${amount} Coins`}
			icon={icon}
			selected={selected}
			disabled={disabled}
			price={price}
		/>
	);
};
