import z from "zod";
import { AccountSchema } from "@/shared/schemas/Account";
import { RegistrationKeySchema } from "@/shared/schemas/Registrations";
import { SessionSchema } from "@/shared/schemas/Session";

export const AccountDetailsContractSchema = {
	input: z.unknown().optional(),
	output: AccountSchema.omit({ password: true }).extend({
		sessions: z.array(SessionSchema.omit({ token: true })),
		registration: RegistrationKeySchema.omit({
			recoveryKey: true,
			accountId: true,
		}).nullable(),
	}),
};

export type AccountDetailsContractInput = z.infer<
	typeof AccountDetailsContractSchema.input
>;
export type AccountDetailsContractOutput = z.input<
	typeof AccountDetailsContractSchema.output
>;
