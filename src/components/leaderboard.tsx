import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    useAccountClient,
    useCore,
    useSyncStatus,
} from "@primodiumxyz/core/react";
import { createUtils, entityToPlayerName } from "@primodiumxyz/core";
import { useEffect, useMemo, useState } from "react";
import { Progress } from "./ui/progress";
import { Entity, query } from "@primodiumxyz/reactive-tables";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useAccount } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { Address } from "viem";
import { Quest, questToName, questToPoints } from "@/lib/quests";

export const Leaderboard = ({ allianceEntity }: { allianceEntity?: Entity }) => {
    const { tables, sync } = useCore();
    const { loading, progress } = useSyncStatus();
    const { getAsteroidInfo } = createUtils(tables);
    const { playerAccount } = useAccountClient();
    const [earnedPoints, setEarnedPoints] = useState<number | undefined>();


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
    }, [playerPoints]);

    if (loading) return <Progress value={progress * 100} className="w-2/3 h-6" />;
    return (
        <div className="w-full max-w-6xl mx-auto py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    earnedPoints ? (
                        <Card className="p-6 flex flex-col gap-4">
                            <CardHeader>
                                <CardTitle>Your Points</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <TrophyIcon className="h-24 w-24 rounded-md" />
                                    <div>
                                        <div className="text-4xl font-bold">{1234} Points</div>
                                    </div>
                                </div>
                            </CardContent>
                            <div className=" flex items-center space-x-4 rounded-md border border-emerald-500/50 p-4">
                                <div className="flex-1 space-y-5">
                                    <p className="text-sm font-medium leading-none">
                                        Connected Account
                                    </p>
                                    <div className="text-sm rounded p-2 grid gap-1 border rounded grid-rows-2">
                                        <p>{entityToPlayerName(playerAccount.entity)}</p>
                                        <p className="text-muted-foreground">{playerAccount.address}</p>
                                    </div>
                                </div>
                            </div>
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
                            <div className=" flex items-center space-x-4 rounded-md border border-emerald-500/50 p-4">
                                <div className="flex-1 space-y-5">
                                    <p className="text-sm font-medium leading-none">
                                        Connected Account
                                    </p>
                                    <div className="text-sm rounded p-2 grid gap-1 border rounded grid-rows-2">
                                        <p>{entityToPlayerName(playerAccount.entity)}</p>
                                        <p className="text-muted-foreground">{playerAccount.address}</p>
                                    </div>
                                </div>
                            </div>
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
                                            {/* <Avatar>
                                                <AvatarImage src="/placeholder-user.jpg" />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar> */}
                                            <p>{shortenAddress(player as Address)}</p>
                                            {/* <div className="text-sm rounded p-2 grid gap-1 border rounded grid-rows-2">
                                                <p>{entityToPlayerName(player as Entity)}</p>
                                                <p className="text-muted-foreground">{shortenAddress(player as Address)}</p>
                                            </div> */}
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

function PuzzleIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
        </svg>
    )
}


function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    )
}


function StarIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
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


function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
    )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}