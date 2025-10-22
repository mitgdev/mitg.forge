const Configuration = {
	extends: ["@commitlint/config-conventional"],
	ignores: [
		(/** @type {string | string[]} */ message) => message.includes("Release"),
	],
	rules: {
		"scope-enum": [
			2,
			"always",
			[
				"changeset",
				"backend",
				"native",
				"database",
				"website",
				"logger",
				"emails",
				"package",
				"multiple",
				"all",
			],
		],
		"scope-empty": [0],
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"tests",
				"chore",
				"revert",
				"database",
			],
		],
	},
};

module.exports = Configuration;
