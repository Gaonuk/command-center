import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    useAccountClient,
    useCore,
    usePlayerAsteroids,
    useSyncStatus,
} from "@primodiumxyz/core/react";
import {
    chainConfigs,
    createUtils,
} from "@primodiumxyz/core";
import { Entity, query, useQuery } from "@primodiumxyz/reactive-tables";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect } from "react";
import { Progress } from "./ui/progress";
import { useWatchContractEvent } from "wagmi";

export const Actions = () => {
    const { sync, tables } = useCore();

    // account client contains the player account data
    const { playerAccount } = useAccountClient();

    useEffect(() => {
        // sync to ensure the client shows the correct data
        sync.syncPlayerData(playerAccount.address, playerAccount.entity);
    }, [sync, playerAccount.entity, playerAccount.address]);


    // useSyncStatus lets you know if the client is syncing to some piece of data (like player data above).
    const { loading, progress } = useSyncStatus(playerAccount.entity);

    if (loading) return <Progress value={progress * 100} className="w-2/3 h-6" />;
    return (
        <Card className="w-full relative col-span-5 xl:col-span-3">
            {playerAccount ? (
                <ActionsTable playerEntity={playerAccount.entity} />
            ) : (
                <div />
            )}
        </Card>
    );
};

const ActionsTable = ({ playerEntity }: { playerEntity: Entity }) => {
    const { tables } = useCore();
    const {
        getAllianceNameFromPlayer,
        getResourceCounts,
        getAsteroidResourceCount
    } = createUtils(tables);

    const alliances = tables.Alliance.getAll();
    const playersInAlliance = useQuery({
        withProperties: [{ table: tables.PlayerAlliance, properties: { alliance: alliances[42] } }]
    });
    console.log('playersInAlliance', playersInAlliance);
    const asteroids = usePlayerAsteroids(playersInAlliance[0]);
    console.log('asteroids', asteroids);
    const asteroidResources = getAsteroidResourceCount(asteroids[0]);
    console.log('asteroidResources', asteroidResources);

    const asteroidsQuery = useQuery({
        withProperties: [{ table: tables.OwnedBy, properties: { value: playersInAlliance[0] } }]
    })
    console.log('asteroidsQuery', asteroidsQuery);

    // useWatchContractEvent({
    //     address: "0xcdde8dc29bcb7a7b30e22318746dfd81f0510b43",
    //     eventName: "Store_SetRecord",
    //     abi: [{
    //         type: "event",
    //         name: "Store_SetRecord",
    //         inputs: [
    //             {
    //                 name: "tableId",
    //                 type: "bytes32",
    //                 indexed: true,
    //                 internalType: "ResourceId",
    //             },
    //             {
    //                 name: "keyTuple",
    //                 type: "bytes32[]",
    //                 indexed: false,
    //                 internalType: "bytes32[]",
    //             },
    //             {
    //                 name: "staticData",
    //                 type: "bytes",
    //                 indexed: false,
    //                 internalType: "bytes",
    //             },
    //             {
    //                 name: "encodedLengths",
    //                 type: "bytes32",
    //                 indexed: false,
    //                 internalType: "EncodedLengths",
    //             },
    //             {
    //                 name: "dynamicData",
    //                 type: "bytes",
    //                 indexed: false,
    //                 internalType: "bytes",
    //             }
    //         ],
    //         anonymous: false,
    //     }],
    //     chainId: chainConfigs["calderaSepolia"].id,
    //     onLogs(logs) {
    //         console.log("Store_SetRecord", logs);
    //     }
    // });

    return (
        <>
            <ScrollArea>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Player Information
                    </CardTitle>
                    <CardDescription>
                        Alliance: {getAllianceNameFromPlayer(playerEntity)}
                    </CardDescription>
                </CardHeader>
            </ScrollArea>
        </>
    );
};
