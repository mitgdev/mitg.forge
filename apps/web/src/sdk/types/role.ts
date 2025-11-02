import type { api } from "../lib/api/factory";

export type Role = Awaited<
	ReturnType<typeof api.client.miforge.accounts.details>
>["characters"][number]["group_id"];
