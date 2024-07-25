import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Menu, User, Wrench } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { useAccount, useDisconnect } from "wagmi";
import type { View } from "@/types";
import views from "@/lib/views";
import { authorizedWallets } from "@/constants/authorized-wallets";

interface DropdownProps {
	setView: (view: View) => void;
}

export function Dropdown({ setView }: DropdownProps) {
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	return (
		address && (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
						<span className="sr-only">Account Settings</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>{shortenAddress(address)}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => setView(views.profile)}>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
						{authorizedWallets.includes(address.toLowerCase()) && (
							<DropdownMenuItem onClick={() => setView(views.admin)}>
								<Wrench className="mr-2 h-4 w-4" />
								<span>Admin</span>
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => disconnect()}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	);
}
