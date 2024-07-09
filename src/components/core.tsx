import { useMemo, useRef } from "react";

import { useAccount } from "wagmi";
import { Core as CoreType, createCore } from "@primodiumxyz/core";
import { AccountClientProvider, CoreProvider } from "@primodiumxyz/core/react";
import { coreConfig } from "@/lib/coreConfig";
// import { Dashboard } from "./dashboard";
import MainDashboard from "./dashboard";

function Core() {
  const coreRef = useRef<CoreType | null>(null);
  const account = useAccount();

  // core contains all the game state logic, and function calls. It is the main interface to the game
  const core: CoreType = useMemo(() => {
    if (coreRef.current) coreRef.current.network.world.dispose();
    const core = createCore(coreConfig);
    coreRef.current = core;
    return core;
  }, []);

  if (!account.isConnected) return null;

  return (
    <CoreProvider {...core}>
      <AccountClientProvider playerAddress={account.address}>
        <MainDashboard />
      </AccountClientProvider>
    </CoreProvider>
  );
}
export default Core;
