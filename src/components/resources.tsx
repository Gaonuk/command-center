import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    useCore,
    useSyncStatus,
} from "@primodiumxyz/core/react";
import {
    createUtils,
    formatResourceCount,
    getEntityTypeName,
} from "@primodiumxyz/core";
import { useEffect, useMemo } from "react";
import { Progress } from "./ui/progress";
import { Entity, query } from "@primodiumxyz/reactive-tables";
import { imageForResourceId, ResourceId } from "@/lib/resources";

export const Resources = ({ allianceEntity }: { allianceEntity?: Entity }) => {
    const { tables, sync } = useCore();
    const { loading, progress } = useSyncStatus();
    const { getAsteroidResourceCount } = createUtils(tables);

    const asteroids = useMemo(() => {
        const playersInAlliance = query({
            withProperties: [{ table: tables.PlayerAlliance, properties: { alliance: allianceEntity } }]
        });

        let newAsteroids: Entity[] = [];

        for (const player of playersInAlliance) {
            const playerAsteroids = query({
                withProperties: [{ table: tables.OwnedBy, properties: { value: player } }]
            })
            newAsteroids = [...newAsteroids, ...playerAsteroids];
        }

        return newAsteroids;
    }, [allianceEntity]);

    useEffect(() => {
        for (const asteroid of asteroids) {
            sync.syncAsteroidData(asteroid);
        }
    }, [asteroids]);

    const resources = useMemo(() => {
        let newResources: Record<string, bigint> = {};
        for (const asteroid of asteroids) {
            const asteroidResources = getAsteroidResourceCount(asteroid);
            const allResources = [...asteroidResources.entries()].slice(0, 10);
            for (const [resource, data] of allResources) {
                if (newResources[resource]) {
                    newResources[resource] += data.resourceCount;
                } else {
                    newResources[resource] = data.resourceCount;
                }
            }
        }
        return newResources;
    }, [asteroids]);

    if (!allianceEntity) {
        return <div> No alliance selected. </div>
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
                        <img src="src/assets/asteroid.png" width={48} height={48} alt="Network Traffic" className="rounded-md" />
                        <div>
                            <div className="text-4xl font-bold">{asteroids.length}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {
                resources && Object.entries(resources).map(([resource, count]) => (
                    <Card key={resource}>
                        <CardHeader>
                            <CardTitle>{getEntityTypeName(resource as Entity)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <img src={`src/assets/resources/${imageForResourceId[resource as ResourceId]}.png`} width={48} height={48} alt="Network Traffic" className="rounded-md" />
                                <div>
                                    <div className="text-4xl font-bold">{formatResourceCount(resource as Entity, count)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
};
