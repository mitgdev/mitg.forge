import { oo } from "@orpc/openapi";
import { os } from "@orpc/server";
import z from "zod";

import type { CreatedHttpContext } from "@/infra/context/http";

type Meta = {
	permission?: Permission;
};

export const base = os
	.errors({
		BAD_REQUEST: oo.spec(
			{
				data: z.object({
					issues: z.array(
						z.object({
							original: z.string(),
							code: z.string(),
							message: z.string(),
							inclusive: z.boolean(),
							path: z.array(z.string()),
						}),
					),
				}),
			},
			{},
		),
		INTERNAL_SERVER_ERROR: oo.spec({}, {}),
	})
	.$context<CreatedHttpContext>()
	.$meta<Meta>({});
