import { getAllQuests } from "@/integrations";
import type { Quest } from "@/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./quests/column";
import { DataTable } from "./quests/data-table";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Admin() {
	const [quests, setQuests] = useState<Quest[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchQuests();
	}, []);

	const fetchQuests = async () => {
		setIsLoading(true);
		const quests = await getAllQuests();
		setQuests(quests);
		setIsLoading(false);
	};

	return (
		quests && (
			<div className="grid grid-rows-2 grid-flow-col gap-4">
				<Card>
					<CardHeader className="px-4 py-3 flex flex-row justify-between sm:px-6 gap-4 items-center">
						<CardTitle>Quests</CardTitle>
						<Button className="transition-colors gap-2" onClick={fetchQuests}>
							<span>Refresh</span>
							<RefreshCw
								size={18}
								className={isLoading ? "animate-spin" : ""}
							/>
						</Button>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={quests} />
					</CardContent>
				</Card>
			</div>
		)
	);
}
