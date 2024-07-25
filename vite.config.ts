import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	optimizeDeps: {
		esbuildOptions: {
			supported: {
				bigint: true,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
