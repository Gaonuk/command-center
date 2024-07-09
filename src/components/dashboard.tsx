/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CEnoDBMcJns
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react"
import { Entity } from "@primodiumxyz/reactive-tables"
import { useAccountClient, useCore } from "@primodiumxyz/core/react"
import { createUtils } from "@primodiumxyz/core";
import { Resources } from "./resources";
import { Fleets } from "./fleets";

export default function MainDashboard() {
    const { tables, sync } = useCore();
    const [selectedAlliance, setSelectedAlliance] = useState<Entity | undefined>(undefined);
    const { getAllianceName } = createUtils(tables);
    const alliances = tables.Alliance.getAll();

    const { playerAccount } = useAccountClient();

    useEffect(() => {
        sync.syncPlayerData(playerAccount.address, playerAccount.entity);
    }, [playerAccount.entity, playerAccount.address]);

    useEffect(() => {
        if (selectedAlliance) {
            sync.syncAllianceData(selectedAlliance);
        }
    }, [selectedAlliance]);

    return (
        <div className="flex flex-col w-full min-h-screen">
            <header className="bg-background border-b px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold">
                        Acme Dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select onValueChange={(value) => setSelectedAlliance(value as Entity)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Alliance" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                alliances.map((alliance) => (
                                    <SelectItem value={alliance}>{getAllianceName(alliance)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <ConnectKitButton />
                </div>
            </header>
            <div className="flex-1 bg-muted/40 p-4 md:p-8">
                <h1 className="text-4xl font-semibold mb-5">{selectedAlliance && getAllianceName(selectedAlliance)} Alliance Information</h1>
                <Tabs defaultValue="resources">
                    <TabsList className="flex items-center gap-4">
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="fleets">Fleets</TabsTrigger>
                        {
                            selectedAlliance && getAllianceName(selectedAlliance) === "WASD" && (
                                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                            )
                        }
                    </TabsList>
                    <TabsContent value="resources">
                        <Resources allianceEntity={selectedAlliance} />
                    </TabsContent>
                    <TabsContent value="fleets">
                        <Fleets allianceEntity={selectedAlliance} />
                    </TabsContent>
                    <TabsContent value="leaderboard">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Rank</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">1</TableCell>
                                    <TableCell>0x123456789abcdef0123456789abcdef01234567</TableCell>
                                    <TableCell className="text-right">10,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">2</TableCell>
                                    <TableCell>0x7890abcdef0123456789abcdef0123456789ab</TableCell>
                                    <TableCell className="text-right">9,500</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">3</TableCell>
                                    <TableCell>0xfedcba9876543210fedcba9876543210fedcba</TableCell>
                                    <TableCell className="text-right">9,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">4</TableCell>
                                    <TableCell>0x0123456789abcdef0123456789abcdef01234</TableCell>
                                    <TableCell className="text-right">8,500</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">5</TableCell>
                                    <TableCell>0x9876543210fedcba9876543210fedcba98765</TableCell>
                                    <TableCell className="text-right">8,000</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
            <footer className="bg-background border-t px-4 py-3 flex items-center justify-center sm:px-6">
                <p className="text-sm text-muted-foreground">Built by Duck, Sponsored by WASD</p>
            </footer>
        </div>
    )
}