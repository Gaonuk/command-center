import { useCore } from "@primodiumxyz/core/react";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

export default function Polling() {
	const { network } = useCore();
	const { latestBlockNumber$ } = network;

	const [blockNumber, setBlockNumber] = useState<bigint>(BigInt(0));

	useEffect(() => {
		const subscription = latestBlockNumber$.subscribe({
			next: (newValue: bigint) => {
				setBlockNumber(newValue);
			},
		});

		// Clean up the subscription when the component unmounts
		return () => subscription.unsubscribe();
	}, [latestBlockNumber$]);

	const blockExternalLinkHref =
		"https://primodium-sepolia.explorer.caldera.xyz/block/";

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center">
						<a
							href={`${blockExternalLinkHref}${blockNumber}`}
							className="text-sm"
						>
							{blockNumber?.toString()}&ensp;
						</a>
						<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>The most recent block number on Primodium's network.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
