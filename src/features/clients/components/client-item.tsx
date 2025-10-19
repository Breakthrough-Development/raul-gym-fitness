"use client";
import { DeleteOption } from "@/components/delete-payment-option";
import { EditClientOption } from "@/components/edit-client-option";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteClient } from "@/features/clients/actions/delete-client";
import { ClientPath } from "@/paths";
import clsx from "clsx";
import {
  LucideMail,
  LucideMoreHorizontal,
  LucidePhone,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { ClientWithMetadata } from "../types";

export type ClientItemProps = {
  client: ClientWithMetadata;
  isDetail?: boolean;
};

export const ClientItem = ({ client, isDetail }: ClientItemProps) => {
  const formatPhoneNumber = (raw: string | null | undefined) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
        7
      )}`;
    }
    return raw;
  };
  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ClientPath(client.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
        <span className="sr-only">View client {client.id}</span>
      </Link>
    </Button>
  );

  return (
    <div
      className={clsx("w-full flex flex-col gap-y-4", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex gap-x-2">
              {client.nombre} {client.apellido}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul
              className={clsx("whitespace-break-spaces flex flex-col gap-y-2")}
            >
              <li className="flex items-center gap-x-2">
                <LucideMail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <LucidePhone className="h-4 w-4 text-muted-foreground" />
                <span>{formatPhoneNumber(client.telefono)}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};
