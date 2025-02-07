import type { Core, CoreConfig } from "@primodiumxyz/core";
import { Read, Sync } from "@primodiumxyz/sync-stack";

export const runCustomSync = (
	network: Core["network"],
	coreConfig: CoreConfig,
	setLoading: (bool: boolean) => void,
) => {
	const { tables, storageAdapter } = network;
	const { chain, worldAddress } = coreConfig;
	const { indexerUrl } = chain;

	if (!indexerUrl) {
		console.warn("Indexer URL not provided, can't sync from indexer.");
		return;
	}

	const sync = Sync.withCustom({
		reader: Read.fromDecodedIndexer.query({
			indexerUrl,
			query: {
				address: worldAddress,
				queries: [
					// sync events from this table and hydrate it
					{ tableId: tables.Alliance.id },
					{ tableId: tables.PlayerAlliance.id },
					{ tableId: tables.ResourceCount.id },
					{ tableId: tables.OwnedBy.id },
					{ tableId: tables.UnitCount.id },
					{ tableId: tables.Asteroid.id },
					{ tableId: tables.Keys_AsteroidSet.id },
					{ tableId: tables.AsteroidCount.id },
					{ tableId: tables.Home.id },
					{ tableId: tables.BuildingType.id },
					{ tableId: tables.IsFleet.id },
					{ tableId: tables.Systems.id },
					{ tableId: tables.SystemRegistry.id },
					{ tableId: tables.FunctionSignatures.id },
					{ tableId: tables.FunctionSelectors.id },
					{ tableId: tables.UserDelegationControl.id },
				],
			},
		}),
		writer: storageAdapter,
	});

	sync.start(
		(_, __, progress) => {
			console.log(`Syncing from Indexer: ${progress * 100}%`);

			if (progress === 1) {
				console.log("Synced from Indexer");
				setLoading(false);
			}
		},
		(err: unknown) => {
			console.error("Error syncing from Indexer", err);
		},
	);

	network.world.registerDisposer(sync.unsubscribe);
};
