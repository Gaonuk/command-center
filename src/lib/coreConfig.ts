import { chainConfigs, CoreConfig } from "@primodiumxyz/core";
import { Hex } from "viem";

export const coreConfig: CoreConfig = {
  chain: chainConfigs["calderaSepolia"],
  worldAddress: "0xcdde8dc29bcb7a7b30e22318746dfd81f0510b43",
  initialBlockNumber: 8283703n,
  runSync: true,
  runSystems: true,
  devPrivateKey: import.meta.env.PRI_DEV_PKEY as Hex,
  accountLinkUrl: import.meta.env.PRI_ACCOUNT_LINK_VERCEL_URL as string,
};
