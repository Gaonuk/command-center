import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { ConnectKitButton } from "connectkit";

export function Login() {
	return (
		<ConnectKitButton.Custom>
			{({ show }) => {
				return (
					<Card>
						<Button variant="outline" size="icon" onClick={show}>
							<LogIn className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
							<span className="sr-only">Connect Wallet</span>
						</Button>
					</Card>
				);
			}}
		</ConnectKitButton.Custom>
	);
}
