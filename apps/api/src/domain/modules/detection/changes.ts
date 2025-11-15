import { injectable } from "tsyringe";

type DiffOptions<Input, Target> = {
	fields?: (keyof Input & keyof Target)[];
};

@injectable()
export class DetectionChanges {
	private isShallowEqual(a: unknown, b: unknown): boolean {
		if (a instanceof Date && b instanceof Date) {
			return a.getTime() === b.getTime();
		}
		return Object.is(a, b);
	}

	// biome-ignore lint/complexity/noBannedTypes: <utility>
	private getChangedFields<Input extends Object, Target extends Object>(
		input: Input,
		target: Target,
		options: DiffOptions<Input, Target> = {},
	) {
		const changed: Partial<Target> = {};
		const keys =
			options.fields ?? (Object.keys(input) as (keyof Input & keyof Target)[]);

		for (const key of keys) {
			const incoming = input[key];

			if (incoming === undefined) continue;

			const current = target[key];

			if (!this.isShallowEqual(incoming, current)) {
				// biome-ignore lint/suspicious/noExplicitAny: <utility>
				(changed as any)[key] = incoming;
			}
		}

		return changed;
	}

	hasChanges<TInput extends object, TTarget extends object>(
		input: TInput,
		target: TTarget,
		options?: DiffOptions<TInput, TTarget>,
	): boolean {
		return (
			Object.keys(this.getChangedFields(input, target, options)).length > 0
		);
	}
}
