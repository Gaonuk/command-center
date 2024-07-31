import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { activateQuest, deactivateQuest, deleteQuest } from "@/integrations";
import type { Quest } from "@/types/quest";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	MoreHorizontal,
	Pen,
	PowerIcon,
	PowerOff,
	X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export const columns: ColumnDef<Quest>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "points",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Points
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const amount = Number.parseInt(row.getValue("points"));
			return <div className="text-center font-medium">{amount}</div>;
		},
	},
	{
		accessorKey: "active",
		header: "Active",
	},
	{
		accessorKey: "createdAt",
		header: "Created at",
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return <div>{date.toDateString()}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						{row.getValue("active") ? (
							<DropdownMenuItem
								onClick={async () => {
									const id = row.getValue("id");
									const deactivatePromise = deactivateQuest(id as number);
									toast.promise(deactivatePromise, {
										loading: "Deactivating quest...",
										success: "Quest deactivated",
										error: "Failed to deactivate quest",
									});
								}}
							>
								<PowerOff className="mr-2 h-4 w-4" />
								<span>Deactivate Quest</span>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem
								onClick={async () => {
									const activatePromise = activateQuest(row.getValue("id"));
									toast.promise(activatePromise, {
										loading: "Activating quest...",
										success: "Quest activated",
										error: "Failed to activate quest",
									});
								}}
							>
								<PowerIcon className="mr-2 h-4 w-4" />
								<span>Activate Quest</span>
							</DropdownMenuItem>
						)}

						<DropdownMenuItem
							onClick={async () => {
								const deletePromise = deleteQuest(row.getValue("id"));
								toast.promise(deletePromise, {
									loading: "Deleting quest...",
									success: "Quest deleted",
									error: "Failed to delete quest",
								});
							}}
						>
							<X className="mr-2 h-4 w-4" />
							<span>Delete Quest</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								console.log("quest", row.getValue("id"));
							}}
							disabled
						>
							<Pen className="mr-2 h-4 w-4" />
							<span>Edit Quest</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
