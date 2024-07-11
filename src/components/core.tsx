import { useMemo, useRef, useState } from "react";

import { useAccount } from "wagmi";
import { Core as CoreType, createCore } from "@primodiumxyz/core";
import { AccountClientProvider, CoreProvider } from "@primodiumxyz/core/react";
import { coreConfig } from "@/lib/coreConfig";
// import { Dashboard } from "./dashboard";
import MainDashboard from "./dashboard";
import { runCustomSync } from "@/lib/runCustomSync";

function Core() {
  const [loading, setLoading] = useState<boolean>(true);
  const coreRef = useRef<CoreType | null>(null);
  const account = useAccount();

  // core contains all the game state logic, and function calls. It is the main interface to the game
  const core: CoreType = useMemo(() => {
    if (coreRef.current) coreRef.current.network.world.dispose();
    const core = createCore(coreConfig);
    coreRef.current = core;
    runCustomSync(core.network, coreConfig, setLoading);
    return core;
  }, []);

  if (!account.isConnected) return null;

  return (
    <CoreProvider {...core}>
      <AccountClientProvider playerAddress={account.address}>
        {
          loading ? (
            <div className="w-2/3 h-6">
              <h4 className="text-xl font-semibold tracking-tight mb-4">
                Loading Game Data...
              </h4>
            </div>
          ) : (
            <MainDashboard />
          )
        }
      </AccountClientProvider>
    </CoreProvider>
  );
}
export default Core;
