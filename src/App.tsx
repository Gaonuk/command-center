import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { wagmiConfig } from "./lib/wagmiConfig";
import { Connect } from "./components/connect";
import Core from "./components/core";
import { ConnectKitProvider } from "connectkit";

const queryClient = new QueryClient();

export default function App() {
  return (
    <div className="w-screen h-screen m-auto p-2 xl:p-10 flex flex-col items-center justify-center">
      {/* Wagmi handles the connection to the blockchain and the wallet */}
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="midnight">
            <Connect />
            <Core />
            <Toaster />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <div id="modal-root" className="fixed top-0 pointer-events-auto z-50" />
    </div>
  );
}
