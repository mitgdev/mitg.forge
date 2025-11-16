import z from "zod";

export const TibiaClientSessionSchema = z.object({
	sessionkey: z.string(),
	lastlogintime: z.number(),
	ispremium: z.boolean(),
	premiumuntil: z.number(),
	status: z.enum(["active", "frozen", "suspended"]),
	returnernotification: z.boolean(),
	showrewardnews: z.boolean(),
	isreturner: z.boolean(),
	fpstracking: z.boolean(),
	optiontracking: z.boolean(),
	tournamentticketpurchasestate: z.number(),
	emailcoderequest: z.boolean(),
});

export type TibiaClientSession = z.infer<typeof TibiaClientSessionSchema>;
