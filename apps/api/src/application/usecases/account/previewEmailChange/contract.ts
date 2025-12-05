import z from "zod";

export const AccountPreviewEmailChangeContractSchema = {
	input: z.object({
		token: z.string().min(1).max(512),
	}),
	output: z.object({
		newEmail: z.email(),
		expiresAt: z.date(),
	}),
};

export type AccountPreviewEmailChangeContractInput = z.infer<
	typeof AccountPreviewEmailChangeContractSchema.input
>;

export type AccountPreviewEmailChangeContractOutput = z.infer<
	typeof AccountPreviewEmailChangeContractSchema.output
>;
