import z from "zod";
import { Worlds } from "@/shared/schemas/Worlds";

export const WorldsListContractSchema = {
	input: z.undefined(),
	output: z.array(
		Worlds.omit({
			ip: true,
			port: true,
			port_status: true,
			motd: true,
		}),
	),
};

export type WorldsListContractInput = z.infer<
	typeof WorldsListContractSchema.input
>;
export type WorldsListContractOutput = z.input<
	typeof WorldsListContractSchema.output
>;
