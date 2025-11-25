import { render as renderToHtml } from "@react-email/render";
import { type Attributes, createElement, type FunctionComponent } from "react";

export type TemplateName =
	| "RecoveryKey"
	| "AccountCreated"
	| "AccountConfirmationEmail"
	| "AccountChangePasswordWithOld"
	| "AccountChangePasswordCode"
	| "AccountPasswordChanged";

const templates = {
	RecoveryKey: () => import("./templates/RecoveryKey"),
	AccountCreated: () => import("./templates/AccountCreated"),
	AccountConfirmationEmail: () =>
		import("./templates/AccountConfirmationEmail"),
	AccountChangePasswordWithOld: () =>
		import("./templates/AccountChangePasswordWithOld"),
	AccountChangePasswordCode: () =>
		import("./templates/AccountChangePasswordCode"),
	AccountPasswordChanged: () => import("./templates/AccountPasswordChanged"),
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
	const Component = Cmp.default as FunctionComponent<PropsOf<T>>;

	const element = createElement(Component, props as PropsOf<T> & Attributes);

	const html = await renderToHtml(element);

	return html;
}
