import { base } from "@/infra/rpc/base";
import { crashReporterRoute } from "./crashReporter";
import { fpsTrackingRoute } from "./fpsTracking";
import { loginRoute } from "./login";
import { servicesRoute } from "./services";

export const clientRouter = base.prefix("/client").router({
	crashReporter: crashReporterRoute,
	fpsTracking: fpsTrackingRoute,
	login: loginRoute,
	services: servicesRoute,
});
