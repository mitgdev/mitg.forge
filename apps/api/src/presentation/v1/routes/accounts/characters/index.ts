import { base } from "@/infra/rpc/base";
import { createCharacterRoute } from "./create";
import { charactersRoute } from "./list";

export const accountCharactersRoutes = base.prefix("/characters").router({
	list: charactersRoute,
	create: createCharacterRoute,
});
