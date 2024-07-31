import { usePrimodiumContext } from "@/contexts/primodium-context";
import { type ResourceId, imageForResourceId } from "@/lib/resources";
import { formatResourceCount, getEntityTypeName } from "@primodiumxyz/core";
import { useSyncStatus } from "@primodiumxyz/core/react";
import type { Entity } from "@primodiumxyz/reactive-tables";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export const Resources = () => {
	const { loading, progress } = useSyncStatus();
	const { currentAlliance, asteroidsInAlliance, allianceResources } =
		usePrimodiumContext();

	if (!currentAlliance) {
		return <div> No alliance selected. </div>;
	}
	if (loading) return <Progress value={progress * 100} className="w-2/3 h-6" />;
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<Card>
				<CardHeader>
					<CardTitle>Total Asteroids</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<img
							src="assets/asteroid.png"
							width={48}
							height={48}
							alt="Network Traffic"
							className="rounded-md"
						/>
						<div>
							<div className="text-4xl font-bold">
								{asteroidsInAlliance.length}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			{allianceResources?.newResources &&
				Object.entries(allianceResources.newResources).map(
					([resource, count]) => (
						<Card key={resource}>
							<CardHeader>
								<CardTitle>{getEntityTypeName(resource as Entity)}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-4">
									<img
										src={`assets/resources/${imageForResourceId[resource as ResourceId]}.png`}
										width={48}
										height={48}
										alt="Network Traffic"
										className="rounded-md"
									/>
									<div>
										<div className="text-4xl font-bold">
											{formatResourceCount(resource as Entity, count)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					),
				)}
		</div>
	);
};
