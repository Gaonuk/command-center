import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAccountClient } from "@primodiumxyz/core/react";
import { entityToPlayerName } from "@primodiumxyz/core";

type CardProps = React.ComponentProps<typeof Card>;

export function Information({ className, ...props }: CardProps) {
  const { playerAccount } = useAccountClient();

  return (
    <Card className={cn("w-full h-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/icon.png" className="w-[1em] rounded pixel-images" />
          Primodium Client Template
        </CardTitle>
        <CardDescription>
          This template allows you to quickly create automations in Primodium.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className=" flex items-center space-x-4 rounded-md border border-emerald-500/50 p-4">
          <div className="flex-1 space-y-5">
            <p className="text-sm font-medium leading-none">
              Connected Account
            </p>
            <div className="text-sm rounded p-2 grid gap-1 border rounded grid-rows-2">
              <p>{entityToPlayerName(playerAccount.entity)}</p>
              <p className="text-muted-foreground">{playerAccount.address}</p>
            </div>
          </div>
        </div>
        <p>For more information visit:</p>
        <a
          href="https://developer.primodium.com"
          target="_blank"
          referrerPolicy="no-referrer"
          className=""
        >
          <Button className="w-full gap-2" variant={"outline"}>
            <Book />
            Developer Docs
          </Button>
        </a>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap ">
        <p className="opacity-50 text-xs">built with</p>{" "}
        <Badge variant={"secondary"}>shadcn/ui</Badge>
        <Badge variant={"secondary"}>@primodiumxyz/core</Badge>
        <Badge variant={"secondary"}>@primodiumxyz/reactive-tables</Badge>
        <Badge variant={"secondary"}>react+vite</Badge>
      </CardFooter>
    </Card>
  );
}
