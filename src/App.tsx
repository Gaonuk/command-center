import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import Core from "./components/core";
import { wagmiConfig } from "./lib/wagmiConfig";

const queryClient = new QueryClient();

export default function App() {
	return (
		<div className="w-screen h-screen m-auto p-2 xl:p-10 flex flex-col items-center justify-center">
			<WagmiProvider config={wagmiConfig}>
				<QueryClientProvider client={queryClient}>
					<ConnectKitProvider>
						<Core />
						<Toaster
							toastOptions={{
								unstyled: true,
								classNames: {
									toast:
										"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border bg-background text-foreground",
								},
							}}
							position="bottom-right"
						/>
					</ConnectKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
			<div id="modal-root" className="fixed top-0 pointer-events-auto z-50" />
		</div>
	);
}
