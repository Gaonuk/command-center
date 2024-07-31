import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrimodiumContext } from "@/contexts/primodium-context";
import views from "@/lib/views";
import type { View } from "@/types";
import { createUtils } from "@primodiumxyz/core";
import { useCore, useSyncStatus } from "@primodiumxyz/core/react";
import type { Entity } from "@primodiumxyz/reactive-tables";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Admin } from "./admin";
import { Dropdown } from "./dropdown";
import { Fleets } from "./fleets";
import { Leaderboard } from "./leaderboard";
import { Login } from "./log-in";
import Polling from "./pollings";
import { Profile } from "./profile";
import { Resources } from "./resources";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function MainDashboard() {
	const { tables } = useCore();
	const { isConnected } = useAccount();
	const {
		alliances,
		setAlliances,
		playerEntity,
		currentAlliance,
		setCurrentAlliance,
	} = usePrimodiumContext();
	const [view, setView] = useState<View>(views.alliances);
	const { getAllianceName, getAllianceNameFromPlayer } = createUtils(tables);
	const { loading, progress } = useSyncStatus(playerEntity);

	useEffect(() => {
		setAlliances(tables.Alliance.getAll());
	}, [tables.Alliance, setAlliances]);

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
							onValueChange={(value) => setCurrentAlliance(value as Entity)}
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
						{currentAlliance && getAllianceName(currentAlliance)} Alliance
						Information
					</h1>
					<Tabs defaultValue="resources">
						<TabsList className="flex items-center gap-4">
							<TabsTrigger value="resources">Resources</TabsTrigger>
							<TabsTrigger value="fleets">Fleets</TabsTrigger>
							{currentAlliance &&
								playerEntity &&
								(getAllianceName(currentAlliance) === "WASD" ||
									getAllianceName(currentAlliance) === "WASDX") &&
								(getAllianceNameFromPlayer(playerEntity) === "WASD" ||
									getAllianceNameFromPlayer(playerEntity) === "WASDX") && (
									<TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
								)}
						</TabsList>
						<TabsContent value="resources">
							<Resources />
						</TabsContent>
						<TabsContent value="fleets">
							<Fleets />
						</TabsContent>
						<TabsContent value="leaderboard">
							<Leaderboard />
						</TabsContent>
					</Tabs>
				</div>
			)}

			{view === views.profile && (
				<div className="flex-1 bg-muted/40 p-4 md:p-8">
					<Profile />
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
