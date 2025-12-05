import { base } from "@/infra/rpc/base";
import { changeEmailWithPasswordRoute } from "./changeWithPassword";
import { confirmEmailChangeRoute } from "./confirmChange";
import { generateChangeEmailRoute } from "./generateChange";
import { previewEmailChangeRoute } from "./previewChange";

export const emailRoutes = base.prefix("/email").router({
	changeWithPassword: changeEmailWithPasswordRoute,
	generateChange: generateChangeEmailRoute,
	previewChange: previewEmailChangeRoute,
	confirmEmail: confirmEmailChangeRoute,
});
