import { useToast } from "@/components/ui/use-toast";
import React, { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ConnectKitButton } from "connectkit";

export const Connect: React.FC = React.memo(function Connect() {
	const { isConnected } = useAccount();
	const { error } = useConnect();
	const { toast } = useToast();

	useEffect(() => {
		if (error) toast({ title: "Error connecting", description: error.message });
	}, [error, toast]);

	if (isConnected) return null;

	return (
		<Card>
			<CardHeader>Connect an Account</CardHeader>
			<CardContent className="grid grid-cols-2 gap-2 w-full">
				<ConnectKitButton />
			</CardContent>
		</Card>
	);
});
