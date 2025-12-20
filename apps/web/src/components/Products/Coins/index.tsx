import { useEffect, useMemo, useState } from "react";
import { formatter } from "@/sdk/hooks/useMoney";
import { cn } from "@/sdk/utils/cn";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Slider } from "@/ui/Slider";
import {
	BaseProductServiceCard,
	type BaseProductServiceCardProps,
} from "../BaseService";

const COINS_IMAGE = {
	1: "/assets/coins/coins_1.png",
	2: "/assets/coins/coins_2.png",
	3: "/assets/coins/coins_3.png",
	4: "/assets/coins/coins_4.png",
	5: "/assets/coins/coins_5.png",
	6: "/assets/coins/coins_6.png",
};

const COINS_NON_TRANSFERABLE_IMAGE = {
	1: "/assets/coins/non_transferable_coins_1.png",
	2: "/assets/coins/non_transferable_coins_2.png",
	3: "/assets/coins/non_transferable_coins_3.png",
	4: "/assets/coins/non_transferable_coins_4.png",
	5: "/assets/coins/non_transferable_coins_5.png",
	6: "/assets/coins/non_transferable_coins_6.png",
};

type Props = Pick<BaseProductServiceCardProps, "disabled" | "selected"> & {
	baseUnitQuantity: number;
	minUnit: number;
	maxUnit: number;
	unitPriceCents: number;
	coinType?: "transferable" | "non-transferable";
	loading?: boolean;
	onSelect: (quantity: number, effectiveQuantity: number) => void;
	initialUnit?: number;
};

export function ProductCoinsCard(props: Props) {
	const type = props.coinType || "transferable";
	const [value, setValue] = useState<number[]>(() => {
		const base = props.baseUnitQuantity;
		const min = base * props.minUnit;
		const max = base * props.maxUnit;
		const initial = props.initialUnit != null ? props.initialUnit * base : base;
		return [Math.min(max, Math.max(min, initial))];
	});

	const images =
		type === "transferable" ? COINS_IMAGE : COINS_NON_TRANSFERABLE_IMAGE;

	const { maxValue, minValue } = useMemo(() => {
		return {
			maxValue: props.baseUnitQuantity * props.maxUnit,
			minValue: props.baseUnitQuantity * props.minUnit,
		};
	}, [props.baseUnitQuantity, props.maxUnit, props.minUnit]);

	useEffect(() => {
		if (props.initialUnit == null) return;
		const base = props.baseUnitQuantity;
		const min = base * props.minUnit;
		const max = base * props.maxUnit;
		const next = props.initialUnit * base;
		setValue([Math.min(max, Math.max(min, next))]);
	}, [props.initialUnit, props.baseUnitQuantity, props.minUnit, props.maxUnit]);

	const percentage = useMemo(() => {
		const val = ((value[0] - minValue) / (maxValue - minValue)) * 100;
		return Number(val.toFixed(0));
	}, [value, minValue, maxValue]);

	const priceInCents = useMemo(() => {
		const units = value[0] / props.baseUnitQuantity;
		const totalCents = units * props.unitPriceCents;
		return totalCents;
	}, [props.baseUnitQuantity, props.unitPriceCents, value]);

	const quantity = useMemo(() => {
		return value[0] / props.baseUnitQuantity;
	}, [props.baseUnitQuantity, value]);

	return (
		<div className="flex flex-col gap-1">
			<div className="flex flex-row gap-2">
				<BaseProductServiceCard
					disabled={props.disabled}
					selected={props.selected}
					icon={
						<div className="flex justify-center">
							<div className="relative h-16 w-32">
								<img
									src={images[6]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 80,
										},
									)}
								/>
								<img
									src={images[5]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 75 && percentage < 80,
										},
									)}
								/>
								<img
									src={images[4]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 50 && percentage < 75,
										},
									)}
								/>
								<img
									src={images[3]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 30 && percentage < 50,
										},
									)}
								/>
								<img
									src={images[2]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 10 && percentage < 30,
										},
									)}
								/>
								<img
									src={images[1]}
									alt="Coins"
									className={cn(
										"absolute opacity-0 transition-opacity duration-500",
										{
											"opacity-100": percentage >= 0 && percentage < 10,
										},
									)}
								/>
							</div>
						</div>
					}
					title={`${value} Coins`}
					description={`${formatter(priceInCents, {
						cents: true,
					})} *`}
				/>
				<Slider
					id="slider"
					disabled={props.disabled}
					onValueChange={setValue}
					value={value}
					min={minValue}
					step={props.baseUnitQuantity}
					orientation="vertical"
					max={maxValue}
					className="data-[orientation=vertical]:min-h-[150px]"
				/>
			</div>
			<ButtonImage
				variant="greenExtended"
				disabled={props.disabled}
				loading={props.loading}
				onClick={() => props.onSelect(quantity, value[0])}
			>
				{props.selected ? "Atualizar" : "Adicionar"}
			</ButtonImage>
		</div>
	);
}
