import z from "zod";

export const TibiaClientWorldSchema = z.object({
	id: z.number(),
	name: z.string(),
	externaladdress: z.string(),
	externaladdressprotected: z.string(),
	externaladdressunprotected: z.string(),
	externalport: z.number(),
	externalportprotected: z.number(),
	externalportunprotected: z.number(),
	previewstate: z.union([z.literal(0), z.literal(1)]), // if is experimental 0 = ok | 1 = experimental
	location: z.string(),
	anticheatprotection: z.boolean(),
	pvptype: z.union([
		z.literal(0), // PVP
		z.literal(1), // NO_PVP
		z.literal(2), // PVP_ENFORCED
		z.literal(3), // RETRO_PVP
		z.literal(4), // RETRO_HARDCORE
	]),
	istournamentworld: z.boolean(),
	restrictedstore: z.boolean(),
	currenttournamentphase: z.number(),
});

export type TibiaClientWorld = z.infer<typeof TibiaClientWorldSchema>;
