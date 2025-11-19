import z from "zod";

export const AccountEditCharacterContractSchema = {
	input: z.object({
		name: z.string().min(1),
		isHidden: z.boolean().optional(),
		comment: z
			.string()
			.max(2000)
			.refine((val) => val.split("\n").length <= 50, {
				message: "Comment cannot exceed 50 lines",
			})
			.optional(),
	}),
	output: z.void(),
};

export type AccountEditCharacterContractInput = z.infer<
	typeof AccountEditCharacterContractSchema.input
>;

export type AccountEditCharacterContractOutput = z.infer<
	typeof AccountEditCharacterContractSchema.output
>;
