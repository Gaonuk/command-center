import { usePrimodiumContext } from "@/contexts/primodium-context";
import { type UnitId, imageForUnitId } from "@/lib/fleets";
import { getEntityTypeName } from "@primodiumxyz/core";
import { useSyncStatus } from "@primodiumxyz/core/react";
import type { Entity } from "@primodiumxyz/reactive-tables";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export const Fleets = () => {
	const { currentAlliance, allianceUnits, fleetsInAlliance } =
		usePrimodiumContext();
	const { loading, progress } = useSyncStatus(currentAlliance);

	if (!currentAlliance) {
		return <div> No alliance selected. </div>;
	}
	if (loading) return <Progress value={progress * 100} className="w-2/3 h-6" />;
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<Card>
				<CardHeader>
					<CardTitle>Total Fleets</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<img
							src="assets/fleet.png"
							width={48}
							height={48}
							alt="Fleet"
							className="rounded-md"
						/>
						<div>
							<div className="text-4xl font-bold">
								{fleetsInAlliance.length}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			{allianceUnits &&
				Object.entries(allianceUnits).map(([unit, count]) => (
					<Card key={unit}>
						<CardHeader>
							<CardTitle>{getEntityTypeName(unit as Entity)}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4">
								<img
									src={`assets/units/${imageForUnitId[unit as UnitId]}.png`}
									width={48}
									height={48}
									alt="Unit Icon"
									className="rounded-md"
								/>
								<div>
									<div className="text-4xl font-bold">{count.toString()}</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
		</div>
	);
};
