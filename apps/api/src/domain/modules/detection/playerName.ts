import { injectable } from "tsyringe";

@injectable()
export class PlayerNameDetection {
	private readonly forbidden_prefixes = [
		"admin",
		"mod",
		"moderator",
		"gm",
		"game",
		"support",
		"staff",
		"sys",
		"system",
		"server",
	];

	private readonly forbidden_suffixes = [
		"admin",
		"mod",
		"moderator",
		"gm",
		"game",
		"support",
		"staff",
		"sys",
		"system",
		"server",
	];

	private readonly forbidden_names: string[] = ["test"];

	async validate(name: string): Promise<
		| {
				valid: false;
				reason?: string;
		  }
		| { valid: true; name: string }
	> {
		let sanitized = name
			.normalize("NFC")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\p{L} ]+/gu, "");
		sanitized = sanitized.replace(/\s+/g, " ").trim();

		if (this.forbidden_names.includes(name.toLowerCase())) {
			return {
				valid: false,
				reason: "Name is forbidden.",
			};
		}

		if (!sanitized) {
			return {
				valid: false,
				reason: "Name cannot be empty or contain only invalid characters.",
			};
		}

		const compact = sanitized.replace(/\s+/g, "").toLowerCase();
		const prefixCheck = this.forbidden_prefixes.find((prefix) =>
			compact.startsWith(prefix),
		);

		if (prefixCheck) {
			return {
				valid: false,
				reason: `Name cannot start with forbidden prefix: ${prefixCheck}`,
			};
		}

		const suffixCheck = this.forbidden_suffixes.find((suffix) => {
			return compact.endsWith(suffix);
		});

		if (suffixCheck) {
			return {
				valid: false,
				reason: `Name cannot end with forbidden suffix: ${suffixCheck}`,
			};
		}

		return {
			valid: true,
			name: sanitized,
		};
	}
}
