import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRouter } from "./router";

const router = createRouter();

export const App = () => {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
};
