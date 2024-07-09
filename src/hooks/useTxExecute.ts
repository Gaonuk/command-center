import { createExecute } from "@primodiumxyz/core";
import { useAccountClient, useCore } from "@primodiumxyz/core/react";

export const useTxExecute = () => {
  const core = useCore();
  const accountClient = useAccountClient();
  //@ts-expect-error - mud types are too complex so we will ignore for now.
  return createExecute(core, accountClient);
};
