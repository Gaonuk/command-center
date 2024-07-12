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
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react"
import { Entity } from "@primodiumxyz/reactive-tables"
import { useAccountClient, useCore, useSyncStatus } from "@primodiumxyz/core/react"
import { createUtils } from "@primodiumxyz/core";
import { Resources } from "./resources";
import { Fleets } from "./fleets";
import { Progress } from "./ui/progress";
import { Leaderboard } from "./leaderboard";

export default function MainDashboard() {
    const { tables, sync } = useCore();
    const [alliances, setAlliances] = useState<Entity[]>([]);
    const [selectedAlliance, setSelectedAlliance] = useState<Entity | undefined>(undefined);
    const { getAllianceName } = createUtils(tables);

    const { playerAccount } = useAccountClient();
    const { loading, progress } = useSyncStatus(playerAccount.entity);

    useEffect(() => {
        sync.syncPlayerData(playerAccount.address, playerAccount.entity);
        setAlliances(tables.Alliance.getAll());
    }, [playerAccount.entity, playerAccount.address]);

    useEffect(() => {
        if (selectedAlliance) {
            sync.syncAllianceData(selectedAlliance);
        }
    }, [selectedAlliance]);



    if (loading) return (
        <div className="w-2/3 h-6">
            <h4 className="text-xl font-semibold tracking-tight mb-4">
                Loading Game Data...
            </h4>
            <Progress value={progress * 100} className="w-2/3 h-6" />
        </div>
    );
    return (
        <div className="flex flex-col w-full min-h-screen">
            <header className="bg-background border-b px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold">
                        Acme Dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {
                        alliances.length > 0 && (
                            <Select onValueChange={(value) => setSelectedAlliance(value as Entity)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Alliance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        alliances.map((alliance) => (
                                            <SelectItem key={alliance} value={alliance}>{getAllianceName(alliance)}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        )
                    }
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
                            selectedAlliance
                            && (getAllianceName(selectedAlliance) === "WASD"
                                || getAllianceName(selectedAlliance) === "WASDX")
                            // && getAllianceName(selectedAlliance) === getAllianceNameFromPlayer(playerAccount.entity)
                            && (
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
                        <Leaderboard allianceEntity={selectedAlliance} />
                    </TabsContent>
                </Tabs>
            </div>
            <footer className="bg-background border-t px-4 py-3 flex items-center justify-center sm:px-6">
                <p className="text-sm text-muted-foreground">Built by Duck, Sponsored by WASD</p>
            </footer>
        </div>
    )
}