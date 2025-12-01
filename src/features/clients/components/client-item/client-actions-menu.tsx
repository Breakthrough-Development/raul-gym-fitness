"use client";

import { DeleteOption } from "@/components/delete-payment-option";
import { EditClientOption } from "@/components/edit-client-option";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteClient } from "@/features/clients/actions/delete-client";
import { ClientPath } from "@/paths";
import {
  LucideMoreHorizontal,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { ClientWithMetadata } from "../../types";

type ClientActionsMenuProps = {
  client: ClientWithMetadata;
  isDetail?: boolean;
};

export const ClientActionsMenu = ({
  client,
  isDetail,
}: ClientActionsMenuProps) => {
  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ClientPath(client.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
        <span className="sr-only">View client {client.id}</span>
      </Link>
    </Button>
  );

  return (
    <div className="flex flex-col gap-y-1 items-end">
      {!isDetail && detailButton}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <LucideMoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <EditClientOption client={client} />
          <DeleteOption id={client.id} action={deleteClient} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
