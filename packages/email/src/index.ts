import { render } from "@react-email/components";
import { createElement } from "react";

export type TemplateName = "RecoveryKey";

export const templates = {
	RecoveryKey: () => import("./templates/RecoveryKey"),
	// biome-ignore lint/suspicious/noExplicitAny: <no way to avoid using any here>
} satisfies Record<TemplateName, () => Promise<any>>;

export type PropsOf<T extends TemplateName> = T extends keyof typeof templates
	? Awaited<ReturnType<(typeof templates)[T]>> extends {
			// biome-ignore lint/suspicious/noExplicitAny: <no way to avoid using any here>
			default: (p: infer P) => any;
		}
		? P
		: never
	: never;

export async function renderEmail<T extends TemplateName>(
	name: T,
	props: PropsOf<T>,
) {
	const exists = templates[name];
	if (!exists) {
		throw new Error(`Template ${name} does not exist`);
	}

	const mod = await templates[name]();

	if (!mod?.default) {
		throw new Error(`Template ${name} does not have a default export`);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <no way to avoid using any here>
	const Component = mod.default as (p: typeof props) => any;

	// @ts-expect-error
	const html = await render(createElement(Component, props));

	return html;
}
