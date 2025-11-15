import * as geo from "@miforge/core/geo";
import z from "zod";
import { RegistrationKeySchema } from "@/shared/schemas/Registrations";

export const AccountRegistrationKeyContractSchema = {
	input: RegistrationKeySchema.omit({
		accountId: true,
		created_at: true,
		updated_at: true,
		recoveryKey: true,
		id: true,
		phone: true,
	}).extend({
		country: z.enum(geo.COUNTRY_CODES),
		state: z.enum(geo.STATE_CODES),
	}),
	output: RegistrationKeySchema,
};

export type AccountRegistrationKeyContractInput = z.infer<
	typeof AccountRegistrationKeyContractSchema.input
>;
export type AccountRegistrationKeyContractOutput = z.infer<
	typeof AccountRegistrationKeyContractSchema.output
>;
