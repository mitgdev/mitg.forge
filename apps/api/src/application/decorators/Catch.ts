import { ORPCError } from "@orpc/client";
import { env } from "@/infra/env";

// biome-ignore lint/suspicious/noExplicitAny: <decorator>
function resolveClassName(target: any, self: any): string {
	// Quando chamado: `self` é a instância (para métodos de instância) ou o construtor (para estáticos)
	// 1) Preferimos o nome em runtime (pega subclasse)
	if (self?.constructor?.name) return self.constructor.name;
	// 2) Fallback: nome do prototype passado pelo TS decorator
	if (target?.constructor?.name) return target.constructor.name;
	// 3) Fallback final: tenta o próprio alvo (útil para estáticos)
	if (target?.name) return target.name;
	return "UnknownClass";
}

export function Catch() {
	return (
		target: unknown,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) => {
		const original = descriptor.value;

		// biome-ignore lint/suspicious/noExplicitAny: <decorator>
		descriptor.value = async function (this: any, ...args: unknown[]) {
			const className = resolveClassName(target, this);
			const methodName = propertyKey;
			const opName = `${className}.${methodName}`;

			try {
				return await original.apply(this, args);
			} catch (error) {
				if (error instanceof ORPCError) {
					throw error;
				}

				let stack = "";
				let cause: unknown;

				if (error instanceof Error) {
					stack = error.stack ?? "";
					cause = error.cause;
				}

				this?.logger?.error?.(`Error in ${opName ?? original.name}`, {
					error,
					args,
				});

				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "An unexpected error occurred",
					...(env.isDevelopment && {
						data: {
							operation: opName,
							stack: stack,
							cause: cause,
						},
					}),
				});
			}
		};

		return descriptor;
	};
}
