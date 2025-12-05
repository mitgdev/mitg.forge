import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
		visualizer({
			filename: "bundle-analysis.html",
			gzipSize: true,
			brotliSize: true,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					form: ["react-hook-form"],
					react: ["react", "react-dom"],
					tanstack: [
						"@tanstack/react-router",
						"@tanstack/react-query",
						"@tanstack/react-router-devtools",
						"@tanstack/react-query-devtools",
					],
					zod: ["zod"],
				},
			},
		},
	},
});
