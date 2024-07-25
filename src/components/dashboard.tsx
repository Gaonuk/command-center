import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addressToEntity, createUtils } from "@primodiumxyz/core";
import { useCore, useSyncStatus } from "@primodiumxyz/core/react";
import type { Entity } from "@primodiumxyz/reactive-tables";
import { useEffect, useMemo, useState } from "react";
import { Fleets } from "./fleets";
import { Leaderboard } from "./leaderboard";
import { Resources } from "./resources";
import { Progress } from "./ui/progress";
import { decodeEntity } from "@primodiumxyz/reactive-tables/utils";
import { useAccount } from "wagmi";
import { Login } from "./log-in";
import Polling from "./pollings";
import { Dropdown } from "./dropdown";
import views from "@/lib/views";
import type { View } from "@/types";
import { Admin } from "./admin";
import { Button } from "./ui/button";

export default function MainDashboard() {
	const { tables, sync } = useCore();
	const { address, isConnected } = useAccount();
	const [alliances, setAlliances] = useState<Entity[]>([]);
	const [view, setView] = useState<View>(views.alliances);
	const [selectedAlliance, setSelectedAlliance] = useState<Entity | undefined>(
		undefined,
	);
	const { getAllianceName, getAllianceNameFromPlayer } = createUtils(tables);
	const playerEntity = useMemo(() => {
		if (isConnected && address) {
			return addressToEntity(address);
		}
		return undefined;
	}, [address, isConnected]);
	const { loading, progress } = useSyncStatus(playerEntity);

	useEffect(() => {
		if (isConnected) {
			sync.syncPlayerData(address, playerEntity);
		}
		setAlliances(tables.Alliance.getAll());
	}, [tables.Alliance, sync, address, playerEntity, isConnected]);

	const entity =
		"0x000000000000000000000000e213ec68c5c2889d5ca6e5bd980693a15246b7c7000000000000000000000000b3ef48c19cc8b2c1d8850af9809cc70bb63e8dfd";

	const delegator = tables.UserDelegationControl.getEntityKeys(
		entity as Entity,
	);
	console.log("delegator", delegator);

	const result = decodeEntity(
		{
			delegator: "address",
			delegatee: "address",
		},
		entity as Entity,
	);

	console.log("result", result);

	useEffect(() => {
		if (selectedAlliance) {
			sync.syncAllianceData(selectedAlliance);
		}
	}, [selectedAlliance, sync]);

	if (loading)
		return (
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
					<img src="/icon.png" alt="Primodium Logo" className="w-10 h-10" />
					<p className="text-lg font-semibold">Andromeda</p>
				</div>
				<Button
					className="text-sm text-muted-foreground"
					variant="ghost"
					onClick={() => setView(views.alliances)}
				>
					Alliances
				</Button>
				<div className="flex items-center gap-4">
					{view === views.alliances && alliances.length > 0 && (
						<Select
							onValueChange={(value) => setSelectedAlliance(value as Entity)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Alliance" />
							</SelectTrigger>
							<SelectContent>
								{alliances.map((alliance) => (
									<SelectItem key={alliance} value={alliance}>
										{getAllianceName(alliance)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					{isConnected ? <Dropdown setView={setView} /> : <Login />}
				</div>
			</header>
			{view === views.alliances && (
				<div className="flex-1 bg-muted/40 p-4 md:p-8">
					<h1 className="text-4xl font-semibold mb-5">
						{selectedAlliance && getAllianceName(selectedAlliance)} Alliance
						Information
					</h1>
					<Tabs defaultValue="resources">
						<TabsList className="flex items-center gap-4">
							<TabsTrigger value="resources">Resources</TabsTrigger>
							<TabsTrigger value="fleets">Fleets</TabsTrigger>
							{selectedAlliance &&
								playerEntity &&
								(getAllianceName(selectedAlliance) === "WASD" ||
									getAllianceName(selectedAlliance) === "WASDX") &&
								(getAllianceNameFromPlayer(playerEntity) === "WASD" ||
									getAllianceNameFromPlayer(playerEntity) === "WASDX") && (
									<TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
								)}
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
			)}

			{view === views.profile && (
				<div className="flex-1 bg-muted/40 p-4 md:p-8">
					<h1 className="text-4xl font-semibold mb-5">Profile</h1>
					Coming soon...
				</div>
			)}

			{view === views.admin && (
				<div className="flex-1 bg-muted/40 p-4 md:p-8">
					<Admin />
				</div>
			)}

			<footer className="bg-background">
				<div className="w-full border-t px-4 py-3 flex justify-between sm:px-6 gap-4">
					<p className="text-sm text-muted-foreground">For Primodium.</p>
					<p className="text-sm text-muted-foreground">
						Built by{" "}
						<a
							href="https://x.com/GaonukRodrigo"
							target="_blank"
							rel="noreferrer"
							className="text-sky-600"
						>
							Duck
						</a>
						, Sponsored by{" "}
						<a
							href="https://x.com/WASD_0x"
							target="_blank"
							rel="noreferrer"
							className="text-sky-600"
						>
							WASD
						</a>
					</p>

					<Polling />
				</div>
			</footer>
		</div>
	);
}
