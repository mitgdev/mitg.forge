import React, { cloneElement } from "react";
import { cn } from "@/sdk/utils/cn";

type ListItemProps = {
	title: string;
	children: React.ReactNode;
	borderless?: boolean;
	__index__?: number;
	__zebra__?: boolean;
};

const ListItem = ({
	title,
	children,
	borderless = false,
	__index__,
	__zebra__,
}: ListItemProps) => {
	const isOdd = __zebra__ ? (__index__ ?? 0) % 2 === 1 : false;

	return (
		<div
			className={cn("border-septenary border-t", {
				"border-t-0": __index__ === 0,
				"bg-tibia-900": __zebra__ && isOdd,
				"bg-tibia-600": __zebra__ && !isOdd,
			})}
		>
			{/* grid com largura da coluna de título controlada por CSS var */}
			<div className="grid grid-cols-[var(--label-col,minmax(90px,200px))_minmax(0,1fr)] items-center">
				<div
					className={cn(
						"flex h-full items-center border-septenary border-r px-2",
						{
							"border-r-0": borderless,
						},
					)}
				>
					<span className="font-bold font-verdana text-secondary text-sm">
						{title}:
					</span>
				</div>
				<div className="px-2">{children}</div>
			</div>
		</div>
	);
};

type ListProps = {
	zebra?: boolean;
	labelCol?: string;
	className?: string;
	children: React.ReactNode;
};

export const List: React.FC<ListProps> & { Item: typeof ListItem } = ({
	zebra = false,
	labelCol,
	className,
	children,
}) => {
	const mapped = React.Children.map(children, (child, index) => {
		if (!React.isValidElement(child)) return child;

		// biome-ignore lint/suspicious/noExplicitAny: <cancel>
		if ((child.type as any) !== ListItem) return child;

		return cloneElement(child as React.ReactElement<ListItemProps>, {
			__index__: index,
			__zebra__: zebra,
		});
	});

	const style =
		labelCol != null
			? ({ "--label-col": labelCol } as React.CSSProperties)
			: undefined;

	return (
		<div className={cn("overflow-hidden", className)} style={style}>
			{mapped}
		</div>
	);
};

List.Item = ListItem;
