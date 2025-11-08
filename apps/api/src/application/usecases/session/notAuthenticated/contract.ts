import z from "zod";

export const SessionNotAuthenticatedContractSchema = {
	input: z.undefined(),
	output: z.void(),
};

export type SessionNotAuthenticatedContractInput = z.infer<
	typeof SessionNotAuthenticatedContractSchema.input
>;
export type SessionNotAuthenticatedContractOutput = z.infer<
	typeof SessionNotAuthenticatedContractSchema.output
>;
