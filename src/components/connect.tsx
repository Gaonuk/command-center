import React, { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

const connectorIcons: Record<string, string> = {
  ["MetaMask"]: "/web3/metamask.svg",
  ["WalletConnect"]: "/web3/walletconnect.svg",
  ["Coinbase Wallet"]: "/web3/coinbase.svg",
};

export const Connect: React.FC = React.memo(() => {
  const { isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast({ title: "Error connecting", description: error.message });
  }, [error, toast]);

  if (isConnected) return null;

  return (
    <Card>
      <CardHeader>Connect an Account</CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 w-full">
        {connectors.map((connector, i) => (
          <div key={`chunk-${i}`} className="flex flex-row gap-2">
            <Button
              onClick={() => !isPending && connect({ connector })}
              disabled={isPending}
            >
              <div className="flex w-full items-center justify-center gap-2">
                {connectorIcons[connector.name] && (
                  <img
                    src={connectorIcons[connector.name]}
                    className="w-6 h-6"
                  />
                )}
                {connector.name}
              </div>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
