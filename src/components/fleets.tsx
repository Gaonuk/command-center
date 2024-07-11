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
    getEntityTypeName,
} from "@primodiumxyz/core";
import { useEffect, useMemo } from "react";
import { Progress } from "./ui/progress";
import { Entity, query } from "@primodiumxyz/reactive-tables";
import { imageForUnitId, UnitId } from "@/lib/fleets";

export const Fleets = ({ allianceEntity }: { allianceEntity?: Entity }) => {
    const { tables, sync } = useCore();
    const { loading, progress } = useSyncStatus(allianceEntity);
    const { getFleetUnitCounts, getFleets } = createUtils(tables);

    const fleets = useMemo(() => {
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

        let newFleets: Entity[] = [];

        for (const asteroid of newAsteroids) {
            const asteroidFleets = getFleets(asteroid);
            newFleets = [...newFleets, ...asteroidFleets];
        }
        return newFleets;
    }, [allianceEntity]);

    useEffect(() => {
        for (const fleet of fleets) {
            sync.syncFleetData(fleet);
        }
    }, [fleets]);

    const units = useMemo(() => {
        let newUnits: Record<string, bigint> = {};
        for (const fleet of fleets) {
            const fleetUnits = getFleetUnitCounts(fleet);
            const allUnits = [...fleetUnits.entries()]
            for (const [unit, count] of allUnits) {
                if (newUnits[unit]) {
                    newUnits[unit] += count;
                } else {
                    newUnits[unit] = count;
                }
            }
        }
        return newUnits;
    }, [fleets]);

    if (!allianceEntity) {
        return <div> No alliance selected. </div>
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
                        <img src="src/assets/fleet.png" width={48} height={48} alt="Fleet" className="rounded-md" />
                        <div>
                            <div className="text-4xl font-bold">{fleets.length}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {
                units && Object.entries(units).map(([unit, count]) => (
                    <Card key={unit}>
                        <CardHeader>
                            <CardTitle>{getEntityTypeName(unit as Entity)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <img src={`src/assets/units/${imageForUnitId[unit as UnitId]}.png`} width={48} height={48} alt="Unit image" className="rounded-md" />
                                <div>
                                    <div className="text-4xl font-bold">{count.toString()}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
};
