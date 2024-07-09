// import { createClient } from "viem";
import { createConfig, http } from "wagmi";
// import { coinbaseWallet } from "wagmi/connectors";
import { coreConfig } from "./coreConfig";
import { getDefaultConfig } from "connectkit";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [coreConfig.chain],
    transports: {
      [coreConfig.chain.id]: http('https://primodium-sepolia.rpc.caldera.xyz/http'),
    },
    // Required API Keys
    walletConnectProjectId: '',

    // Required App Info
    appName: "Your App Name",
  })
);