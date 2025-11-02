import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRouter } from "./router";

const router = createRouter();

// TODO: Add global test
// TODO Test error boundary
/**
 * TODO: Something
 * - [ ] Task 1
 * - [ ] Task 2
 *
 * description
 */

/**
 * TODO Something else
 * - [ ] Task A
 * - [ ] Task B
 *
 * description
 */

export const App = () => {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
};
