import { createUtils } from "@primodiumxyz/core";
import { useCore } from "@primodiumxyz/core/react";
import { Entity, query } from "@primodiumxyz/reactive-tables";
import { useEffect, useState } from "react";


interface AllianceData {
    resources: Record<string, bigint>;
    asteroids: number;
}


export const useAllianceData = (allianceEntity: Entity): AllianceData => {
    const [resources, setResources] = useState<Record<string, bigint>>({});
    const [asteroids, setAsteroids] = useState<Entity[]>([]);
    const { tables, sync } = useCore();
    const { getAsteroidResourceCount } = createUtils(tables);

    const getAllianceAsteroids = async () => {
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

        setAsteroids(newAsteroids);
    }

    const getAsteroidsResources = async () => {
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
        setResources(newResources);
    }

    const syncAsteroids = async () => {
        if (asteroids.length === 0) return;
        setResources({});
        for (const asteroid of asteroids) {
            sync.syncAsteroidData(asteroid);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            await getAllianceAsteroids();
            await syncAsteroids();
            await getAsteroidsResources();
        }
        fetchData();
    }, [sync]);

    return { resources, asteroids: asteroids.length };
};
