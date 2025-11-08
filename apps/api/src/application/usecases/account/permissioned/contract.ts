import z from "zod";

export const AccountPermissionedContractSchema = {
	input: z.object({
		permission: z
			.object({
				type: z.enum([
					"GUEST",
					"PLAYER",
					"TUTOR",
					"SENIOR_TUTOR",
					"GAME_MASTER",
					"ADMIN",
				]),
			})
			.optional(),
	}),
	output: z.boolean(),
};

export type AccountPermissionedContractInput = z.infer<
	typeof AccountPermissionedContractSchema.input
>;
export type AccountPermissionedContractOutput = z.infer<
	typeof AccountPermissionedContractSchema.output
>;
