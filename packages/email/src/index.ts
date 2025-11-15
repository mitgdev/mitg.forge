import { render as renderToHtml } from "@react-email/render";
import { createElement } from "react";

export type TemplateName = "RecoveryKey";

const templates = {
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

export async function renderTemplate<T extends TemplateName>(
	name: T,
	props: PropsOf<T>,
): Promise<string> {
	const Cmp = await templates[name]();
	const element = createElement(Cmp.default, props);

	const html = await renderToHtml(element);

	return html;
}
