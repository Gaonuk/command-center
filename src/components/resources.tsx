import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Progress } from "./ui/progress";
import { Entity, query, queryMatchingCondition } from "@primodiumxyz/reactive-tables";
import { imageForResourceId, ResourceId } from "@/lib/resources";

export const Resources = ({ allianceEntity }: { allianceEntity?: Entity }) => {
    const { tables, sync } = useCore();
    const { loading, progress } = useSyncStatus();
    const { getAsteroidResourceCount } = createUtils(tables);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const playersInAlliance = query({
        withProperties: [
            { table: tables.PlayerAlliance, properties: { alliance: allianceEntity } },
        ],
    });

    const asteroids = query({
        with: [tables.Asteroid],
        matching: [
            queryMatchingCondition({
                table: tables.OwnedBy,
                where: (properties) => {
                    const { value: ownerEntity } = properties;
                    return playersInAlliance.includes(ownerEntity as Entity);
                }
            })
        ]
    })

    const syncAsteroids = useCallback(() => {
        for (const asteroid of asteroids) {
            sync.syncAsteroidData(asteroid);
        }
    }, [asteroids, sync]);

    useEffect(() => {
        syncAsteroids();
        const intervalId = setInterval(() => {
            syncAsteroids();
            setRefetchIndex((prev) => prev + 1);
        }, 5000);
        return () => clearInterval(intervalId);
    });

    const resources = useMemo(() => {
        const newResources: Record<string, bigint> = {};
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchIndex, getAsteroidResourceCount]);

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
                        <img src="assets/asteroid.png" width={48} height={48} alt="Network Traffic" className="rounded-md" />
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
                                <img src={`assets/resources/${imageForResourceId[resource as ResourceId]}.png`} width={48} height={48} alt="Network Traffic" className="rounded-md" />
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
