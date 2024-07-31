import { getWalletTransactions } from "@/integrations";
import type { Transaction } from "@/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { columns } from "./transactions/column";
import { DataTable } from "./transactions/data-table";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Profile() {
	const { address } = useAccount();
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		if (address) {
			getWalletTransactions(address).then((data) => {
				setTransactions(data);
			});
		}
	}, [address]);

	return (
		transactions && (
			<div className="grid grid-rows-2 grid-flow-col gap-4">
				<Card>
					<CardHeader className="px-4 py-3 flex flex-row justify-between sm:px-6 gap-4 items-center">
						<CardTitle>Transactions</CardTitle>
						<Button className="transition-colors gap-2">
							<span>Sync</span>
							<RefreshCw size={18} className="" />
						</Button>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={transactions} />
					</CardContent>
				</Card>
			</div>
		)
	);
}
