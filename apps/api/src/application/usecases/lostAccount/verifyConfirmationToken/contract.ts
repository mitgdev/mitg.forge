import z from "zod";
import { AccountConfirmation } from "@/shared/schemas/AccountConfirmations";

export const LostAccountVerifyConfirmationTokenContractSchema = {
	input: z.object({
		token: z.string().min(1).max(512),
	}),
	output: AccountConfirmation.pick({
		token: true,
		expires_at: true,
	}),
};

export type LostAccountVerifyConfirmationTokenContractInput = z.infer<
	typeof LostAccountVerifyConfirmationTokenContractSchema.input
>;

export type LostAccountVerifyConfirmationTokenContractOutput = z.infer<
	typeof LostAccountVerifyConfirmationTokenContractSchema.output
>;
