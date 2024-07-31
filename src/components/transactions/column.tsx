import { shortenAddress } from "@/lib/utils";
import type { Transaction } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "function_name",
		header: "Name",
	},
	{
		accessorKey: "args",
		header: "Parameters",
		cell: ({ row }) => {
			return (
				<div className="overflow-x-auto flex whitespace-nowrap max-w-md">
					{`[${(row.getValue("args") as string[]).join(", ")}]`}
				</div>
			);
		},
	},
	{
		accessorKey: "wallet",
		header: "Address",
		cell: ({ row }) => {
			return <div>{shortenAddress(row.getValue("wallet"))}</div>;
		},
	},
	{
		accessorKey: "timestamp",
		header: "Timestamp",
		cell: ({ row }) => {
			const date = new Date(row.getValue("timestamp"));
			return <div>{date.toDateString()}</div>;
		},
	},
	{
		accessorKey: "hash",
		header: "Transaction Hash",
		cell: ({ row }) => {
			const blockExlorerUrl = `https://primodium-sepolia.explorer.caldera.xyz/tx/${row.getValue("hash")}`;
			return (
				<a
					href={blockExlorerUrl}
					target="_blank"
					rel="noreferrer"
					className="flex items-center"
				>
					{shortenAddress(row.getValue("hash"))}
					<ExternalLink
						name="ExternalLink"
						size={16}
						className="ml-1 text-gray-400"
					/>
				</a>
			);
		},
	},
];
