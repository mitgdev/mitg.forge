/** biome-ignore-all lint/suspicious/noExplicitAny: <this a component slot, and can be anything> */
import {
	cloneElement,
	forwardRef,
	isValidElement,
	type ReactElement,
} from "react";

type SlotProps = React.HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode;
};

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
	{ children, ...props },
	ref,
) {
	if (isValidElement(children)) {
		// deixe explícito que é um ReactElement “aberto”
		const child = children as ReactElement<any>;

		// faça o spread em objetos tipados
		const merged: Record<string, unknown> = { ...child.props, ...props };

		// limpa undefined
		for (const k of Object.keys(merged)) {
			if ((merged as any)[k] === undefined) delete (merged as any)[k];
		}

		// passe o ref com cast para driblar a limitação de tipos do cloneElement
		return cloneElement(child, { ...(merged as any), ref } as any);
	}

	// fallback: <div> com casts compatíveis
	return (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			{...(props as React.HTMLAttributes<HTMLDivElement>)}
		>
			{children}
		</div>
	);
});
