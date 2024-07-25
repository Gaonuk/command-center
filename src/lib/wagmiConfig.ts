import { createConfig, http } from "wagmi";
import { coreConfig } from "./coreConfig";
import { getDefaultConfig } from "connectkit";

export const wagmiConfig = createConfig(
	getDefaultConfig({
		chains: [coreConfig.chain],
		transports: {
			[coreConfig.chain.id]: http(
				"https://primodium-sepolia.rpc.caldera.xyz/http",
			),
		},
		// Required API Keys
		walletConnectProjectId: "",

		// Required App Info
		appName: "Andromeda",

		appDescription: "A Primodium Command Center",
		appUrl: "https://command-center-gules.vercel.app/", // your app's url
		appIcon: "https://command-center-gules.vercel.app/icon.png",
	}),
);
