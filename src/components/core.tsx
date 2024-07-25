import { coreConfig } from "@/lib/coreConfig";
import { runCustomSync } from "@/lib/runCustomSync";
import { type Core as CoreType, createCore } from "@primodiumxyz/core";
import { CoreProvider } from "@primodiumxyz/core/react";
import { useMemo, useRef, useState } from "react";
import MainDashboard from "./dashboard";

function Core() {
	const [loading, setLoading] = useState<boolean>(true);
	const coreRef = useRef<CoreType | null>(null);

	// core contains all the game state logic, and function calls. It is the main interface to the game
	const core: CoreType = useMemo(() => {
		if (coreRef.current) coreRef.current.network.world.dispose();
		const core = createCore(coreConfig);
		coreRef.current = core;
		runCustomSync(core.network, coreConfig, setLoading);
		return core;
	}, []);

	return (
		//@ts-expect-error - mud types are too complex so we will ignore for now.
		<CoreProvider {...core}>
			{loading ? (
				<div className="w-2/3 h-6">
					<h4 className="text-xl font-semibold tracking-tight mb-4">
						Loading Game Data...
					</h4>
				</div>
			) : (
				<MainDashboard />
			)}
		</CoreProvider>
	);
}
export default Core;
