import type { api } from "../lib/api/factory";

export type Vocation = Awaited<
	ReturnType<typeof api.client.miforge.accounts.details>
>["characters"][number]["vocation"];
