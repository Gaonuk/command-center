import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

const domNode = document.getElementById("root");
if (!domNode) {
	throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(domNode);
root.render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="ui-theme">
			<TooltipProvider>
				<Analytics />
				<App />
			</TooltipProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
