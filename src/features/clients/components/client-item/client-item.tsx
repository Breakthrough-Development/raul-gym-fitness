"use client";

import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { ClientWithMetadata } from "../../types";
import { ClientActionsMenu } from "./client-actions-menu";
import { ClientCardContent } from "./client-card-content";
import { ClientCardHeader } from "./client-card-header";

type ClientItemProps = {
  client: ClientWithMetadata;
  isDetail?: boolean;
};

export const ClientItem = ({ client, isDetail }: ClientItemProps) => {
  return (
    <div
      className={clsx("w-full flex flex-col gap-y-4", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full">
          <ClientCardHeader
            firstName={client.firstName}
            lastName={client.lastName}
          />
          <ClientCardContent email={client.email} phone={client.phone} />
        </Card>
        <ClientActionsMenu client={client} isDetail={isDetail} />
      </div>
    </div>
  );
};
