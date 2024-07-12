import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    useAccountClient,
    useCore,
    useSyncStatus,
} from "@primodiumxyz/core/react";
import { createUtils, entityToAddress, entityToPlayerName } from "@primodiumxyz/core";
import { useEffect, useMemo, useState } from "react";
import { Progress } from "./ui/progress";
import { Entity, query } from "@primodiumxyz/reactive-tables";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { shortenAddress } from "@/lib/utils";
import { Address } from "viem";
import { Quest, questToName, questToPoints } from "@/lib/quests";

export const Leaderboard = ({ allianceEntity }: { allianceEntity?: Entity }) => {
    const { tables, sync } = useCore();
    const { loading, progress } = useSyncStatus();
    const { getAsteroidInfo } = createUtils(tables);
    const { playerAccount } = useAccountClient();
    const [earnedPoints, setEarnedPoints] = useState<number | undefined>();
    const [totalPoints, setTotalPoints] = useState<number | undefined>();

    const playerPoints = useMemo(() => {
        const playersInAlliance = query({
            withProperties: [{ table: tables.PlayerAlliance, properties: { alliance: allianceEntity } }]
        });

        let playerPoints: Record<string, number> = {};

        for (const player of playersInAlliance) {
            playerPoints[player] = 0;
            const playerAsteroids = query({
                withProperties: [{ table: tables.OwnedBy, properties: { value: player } }]
            })
            for (const asteroid of playerAsteroids) {
                sync.syncAsteroidData(asteroid);
            }
            for (const asteroid of playerAsteroids) {
                const asteroidData = getAsteroidInfo(asteroid);
                console.log('asteroidData', asteroidData)
                const homeBase = query({
                    withProperties: [{ table: tables.Home, properties: { value: asteroid } }]
                })
                // const homeBaseData = getBuildingInfo(homeBase[0]);
                console.log('homeBase', homeBase);
                if (
                    asteroidData.asteroidData
                    && asteroidData.asteroidData.wormhole) {
                    playerPoints[player] += 15;
                }
                if (
                    asteroidData.asteroidData
                    && asteroidData.asteroidData.primodium
                    && asteroidData.asteroidData.primodium > 0n) {
                    if (asteroidData.asteroidData.maxLevel === 3n) {
                        playerPoints[player] += 30;
                    } else if (asteroidData.asteroidData.maxLevel === 6n) {
                        playerPoints[player] += 60;
                    }
                }
            }

        }

        let sortedPoints: [string, number][] = [];
        for (const player in playerPoints) {
            sortedPoints.push([player, playerPoints[player]]);
        }

        sortedPoints.sort((a, b) => b[1] - a[1]);

        return sortedPoints;
    }, [allianceEntity]);

    useEffect(() => {
        for (const [player, points] of playerPoints) {
            if (player === playerAccount.entity) {
                setEarnedPoints(points);
            }
        }
        // sum total points
        let total = 0;
        for (const [_, points] of playerPoints) {
            total += points;
        }
        setTotalPoints(total);
    }, [playerPoints]);

    if (loading) return <Progress value={progress * 100} className="w-2/3 h-6" />;
    return (
        <div className="w-full max-w-6xl mx-auto py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    earnedPoints ? (
                        <Card className="p-6 flex flex-col gap-4">
                            <CardHeader>
                                <CardTitle>
                                    <div className="m-2 flex items-center gap-6">
                                        <TrophyIcon className="h-12 w-12 rounded-md" />
                                        <h1 className="text-4xl font-bold">Quest Points</h1>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-6">
                                    <h1 className="text-2xl">Your points:</h1>
                                    <div className="text-2xl font-bold">{earnedPoints ?? 0}</div>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <h1 className="text-2xl">Total points:</h1>
                                    <div className="text-2xl font-bold">{totalPoints}</div>
                                </div>
                                <div className="flex items-center space-x-4 rounded-md border p-4">
                                    <div className="flex-1 space-y-5">
                                        <p className="p-2 text-sm font-medium leading-none">
                                            Connected Account
                                        </p>
                                        <div className="text-sm rounded p-2 grid gap-1 rounded grid-rows-2">
                                            <p>{entityToPlayerName(playerAccount.entity)}</p>
                                            <p className="text-muted-foreground">{playerAccount.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-6 flex flex-col gap-4">
                            <CardHeader>
                                <CardTitle></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-4xl font-bold">You are not in the alliance</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    )
                }

                <Card className="p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-medium">Active Quests</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                Object.keys(questToPoints).map((quest, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{questToName[quest as Quest]}</TableCell>
                                        <TableCell>{questToPoints[quest as Quest]}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Card>
            </div>
            <Card className="mt-6 p-6">
                <h3 className="text-lg font-medium mb-4">Leaderboard</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead>Home</TableHead>
                            <TableHead>Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            playerPoints.map(([player, points], index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <p>{shortenAddress(entityToAddress(player as Address))}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <p>{entityToPlayerName(player as Entity)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{points}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}