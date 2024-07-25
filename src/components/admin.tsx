import { quests } from "@/constants/quests";
import { columns } from "./quests/column";
import { DataTable } from "./quests/data-table";
// import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "./ui/select";

export function Admin() {
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Quests</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={quests} />
				</CardContent>
			</Card>
			{/* <div className="">
				<Card>
					<CardHeader>
						<CardTitle>Create New Quest</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="space-y-4">
							<div>
								<Label htmlFor="type">Type</Label>
								<Input id="type" placeholder="Enter quest type" />
							</div>
							<div>
								<Label htmlFor="condition">Condition</Label>
								<Input id="condition" placeholder="Enter quest condition" />
							</div>
							<div>
								<Label htmlFor="points">Points</Label>
								<Input
									id="points"
									type="number"
									placeholder="Enter quest points"
								/>
							</div>
							<div>
								<Label htmlFor="status">Status</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button>Create Quest</Button>
						</form>
					</CardContent>
				</Card>
			</div> */}
		</div>
	);
}
