import type { PropsOf, TemplateName } from "@miforge/email";

export enum QueueName {
	Email = "email_send",
}

export type EmailJob<T extends TemplateName> = {
	kind: "EmailJob";
	template: T;
	props: PropsOf<T>;
	to: string;
	subject: string;
	idempotencyKey?: string;
};

export interface JobMap {
	[QueueName.Email]: EmailJob<TemplateName>;
}
