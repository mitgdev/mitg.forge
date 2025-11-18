import z from "zod";
import { TibiaClientCharactersSchema } from "@/shared/schemas/ClientCharacters";
import { TibiaClientErrorSchema } from "@/shared/schemas/ClientError";
import { TibiaClientSessionSchema } from "@/shared/schemas/ClientSession";
import { TibiaClientWorldSchema } from "@/shared/schemas/ClientWorld";
import { FileToText } from "@/shared/utils/fileToText";

const LoginSchema = z
	.object({
		assetversion: z.string().optional(),
		clienttype: z.number().optional(),
		clientversion: z.string().optional(),
		devicecookie: z.string().optional(),
		email: z.email(),
		password: z.string(),
		token: z.string().optional(),
		stayloggedin: z.boolean().optional(),
		type: z.literal("login").optional(),
	})
	.transform((data) => {
		return {
			assetVersion: data.assetversion,
			clientType: data.clienttype,
			clientVersion: data.clientversion,
			deviceCookie: data.devicecookie,
			stayLoggedIn: data.stayloggedin,
			email: data.email,
			password: data.password,
			type: data.type,
			token: data.token,
		};
	});

const LoginFileSchema = z.instanceof(File).transform(async (file) => {
	const text = await FileToText(file);
	return LoginSchema.parse(JSON.parse(text));
});

export const ClientLoginContractSchema = {
	input: z.instanceof(File),
	output: z.union([
		TibiaClientErrorSchema,
		z.object({
			session: TibiaClientSessionSchema,
			playdata: z.object({
				worlds: z.array(TibiaClientWorldSchema),
				characters: z.array(TibiaClientCharactersSchema),
			}),
		}),
	]),
	inside: LoginFileSchema,
};

export type ClientLoginContractInput = z.infer<
	typeof ClientLoginContractSchema.input
>;
export type ClientLoginContractInside = z.infer<
	typeof ClientLoginContractSchema.inside
>;
export type ClientLoginContractOutput = z.infer<
	typeof ClientLoginContractSchema.output
>;
