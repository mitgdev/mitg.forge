import z from "zod";

export const TibiaClientCharactersSchema = z.object({
	worldid: z.number(),
	name: z.string(),
	ismale: z.boolean(),
	tutorial: z.boolean(),
	level: z.number(),
	vocation: z.string(),
	outfitid: z.number(),
	headcolor: z.number(),
	torsocolor: z.number(),
	legscolor: z.number(),
	detailcolor: z.number(),
	addonsflags: z.number(),
	ishidden: z.boolean(),
	istournamentparticipant: z.boolean(),
	ismaincharacter: z.boolean(),
	dailyrewardstate: z.number(), // 0 = not claimed | 1 = claimed
	remainingdailytournamentplaytime: z.boolean(),
});

export type TibiaClientCharacter = z.infer<typeof TibiaClientCharactersSchema>;
