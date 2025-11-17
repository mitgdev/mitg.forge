import { base } from "@/infra/rpc/base";
import { findByNameCharacterRoute } from "./byName";
import { createCharacterRoute } from "./create";
import { charactersRoute } from "./list";

export const accountCharactersRoutes = base.router({
	list: charactersRoute,
	create: createCharacterRoute,
	findByName: findByNameCharacterRoute,
});
