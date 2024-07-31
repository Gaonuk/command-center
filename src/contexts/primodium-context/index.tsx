import { addressToEntity, createUtils } from "@primodiumxyz/core";
import { useCore } from "@primodiumxyz/core/react";
import {
	type Entity,
	query,
	queryMatchingCondition,
} from "@primodiumxyz/reactive-tables";
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAccount } from "wagmi";
import { useContextFactory } from "../hooks";

interface PrimodiumContextProps {
	currentAlliance?: Entity;
	alliances: Entity[];
	playerEntity?: Entity;
	playersInAlliance: Entity[];
	asteroidsInAlliance: Entity[];
	fleetsInAlliance: Entity[];
	allianceResources: {
		newResources: Record<Entity, bigint>;
		refetchIndex: number;
	};
	allianceUnits: Record<Entity, bigint>;
	utils?: ReturnType<typeof createUtils>;
	setCurrentAlliance: React.Dispatch<React.SetStateAction<Entity | undefined>>;
	setAlliances: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const PrimodiumContext = createContext<PrimodiumContextProps>({
	alliances: [],
	currentAlliance: undefined,
	utils: undefined,
	playerEntity: undefined,
	setCurrentAlliance: () => {},
	setAlliances: () => {},
	playersInAlliance: [],
	asteroidsInAlliance: [],
	fleetsInAlliance: [],
	allianceResources: {
		newResources: {},
		refetchIndex: 0,
	},
	allianceUnits: {},
});

interface PrimodiumContextProviderProps {
	children: JSX.Element | JSX.Element[];
}

function PrimodiumContextProvider({
	children,
}: PrimodiumContextProviderProps): JSX.Element {
	const { address, isConnected } = useAccount();
	const { tables, sync } = useCore();
	const [refetchIndex, setRefetchIndex] = useState(0);
	const [currentAlliance, setCurrentAlliance] = useState<Entity | undefined>(
		undefined,
	);
	const [alliances, setAlliances] = useState<Entity[]>([]);

	const utils = useMemo(() => {
		return createUtils(tables);
	}, [tables]);

	const playerEntity = useMemo(() => {
		if (isConnected && address) {
			return addressToEntity(address);
		}
		return undefined;
	}, [address, isConnected]);

	//sync playerData if player is connected
	useEffect(() => {
		if (isConnected) {
			sync.syncPlayerData(address, playerEntity);
		}
	}, [sync, address, playerEntity, isConnected]);

	useEffect(() => {
		if (currentAlliance) {
			sync.syncAllianceData(currentAlliance);
		}
	}, [currentAlliance, sync]);

	const playersInAlliance = useMemo(() => {
		return query({
			withProperties: [
				{
					table: tables.PlayerAlliance,
					properties: { alliance: currentAlliance },
				},
			],
		});
	}, [tables.PlayerAlliance, currentAlliance]);

	const asteroidsInAlliance = useMemo(() => {
		return query({
			with: [tables.Asteroid],
			matching: [
				queryMatchingCondition({
					table: tables.OwnedBy,
					where: (properties) => {
						const { value: ownerEntity } = properties;
						return playersInAlliance.includes(ownerEntity as Entity);
					},
				}),
			],
		});
	}, [tables.Asteroid, tables.OwnedBy, playersInAlliance]);

	const fleetsInAlliance = useMemo(() => {
		let newFleets: Entity[] = [];

		for (const asteroid of asteroidsInAlliance) {
			const asteroidFleets = utils.getFleets(asteroid);
			newFleets = [...newFleets, ...asteroidFleets];
		}
		return newFleets;
	}, [asteroidsInAlliance, utils.getFleets]);

	const syncAsteroids = useCallback(() => {
		console.log("syncing asteroids");
		for (const asteroid of asteroidsInAlliance) {
			sync.syncAsteroidData(asteroid);
		}
	}, [asteroidsInAlliance, sync]);

	useEffect(() => {
		syncAsteroids();
		const intervalId = setInterval(() => {
			syncAsteroids();
			setRefetchIndex((prev) => prev + 1);
		}, 5000);
		return () => clearInterval(intervalId);
	}, [syncAsteroids]);

	useEffect(() => {
		for (const fleet of fleetsInAlliance) {
			sync.syncFleetData(fleet);
		}
	}, [fleetsInAlliance, sync]);

	const allianceResources = useMemo(() => {
		const newResources: Record<Entity, bigint> = {};
		for (const asteroid of asteroidsInAlliance) {
			const asteroidResources = utils.getAsteroidResourceCount(asteroid);
			const allResources = [...asteroidResources.entries()].slice(0, 10);
			for (const [resource, data] of allResources) {
				if (newResources[resource]) {
					newResources[resource] += data.resourceCount;
				} else {
					newResources[resource] = data.resourceCount;
				}
			}
		}
		return {
			newResources,
			refetchIndex,
		};
	}, [asteroidsInAlliance, utils.getAsteroidResourceCount, refetchIndex]);

	const allianceUnits = useMemo(() => {
		const newUnits: Record<string, bigint> = {};
		for (const fleet of fleetsInAlliance) {
			const fleetUnits = utils.getFleetUnitCounts(fleet);
			const allUnits = [...fleetUnits.entries()];
			for (const [unit, count] of allUnits) {
				if (newUnits[unit]) {
					newUnits[unit] += count;
				} else {
					newUnits[unit] = count;
				}
			}
		}

		for (const asteroid of asteroidsInAlliance) {
			const asteroidUnits = utils.getFleetUnitCounts(asteroid);
			const allUnits = [...asteroidUnits.entries()];
			for (const [unit, count] of allUnits) {
				if (newUnits[unit]) {
					newUnits[unit] += count;
				} else {
					newUnits[unit] = count;
				}
			}
		}

		return newUnits;
	}, [fleetsInAlliance, asteroidsInAlliance, utils.getFleetUnitCounts]);

	const context = useMemo(
		() => ({
			alliances,
			utils,
			currentAlliance,
			playerEntity,
			playersInAlliance,
			asteroidsInAlliance,
			fleetsInAlliance,
			allianceResources,
			allianceUnits,
			setCurrentAlliance,
			setAlliances,
		}),
		[
			utils,
			alliances,
			currentAlliance,
			playerEntity,
			playersInAlliance,
			asteroidsInAlliance,
			fleetsInAlliance,
			allianceResources,
			allianceUnits,
		],
	);

	return (
		<PrimodiumContext.Provider value={context}>
			{children}
		</PrimodiumContext.Provider>
	);
}

const usePrimodiumContext = (): PrimodiumContextProps =>
	useContextFactory({
		name: "Primodium",
		context: PrimodiumContext,
	});

export { PrimodiumContext, usePrimodiumContext };

export default PrimodiumContextProvider;
