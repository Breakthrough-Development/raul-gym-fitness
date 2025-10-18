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
import { ClientEditPath, ClientPath } from "@/paths";
import { Payment } from "@prisma/client";
import clsx from "clsx";
import {
  LucideMoreHorizontal,
  LucidePencil,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { ClientWithMetadata } from "../types";

export type ClientItemProps = {
  client: ClientWithMetadata;
  isDetail?: boolean;
};

export const ClientItem = ({ client, isDetail }: ClientItemProps) => {
  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ClientPath(client.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
        <span className="sr-only">View client {client.id}</span>
      </Link>
    </Button>
  );

  const editButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ClientEditPath(client.id)}>
        <LucidePencil className="h-4 w-4" />
        <span className="sr-only">Edit client {client.id}</span>
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
              {client.firstName} {client.lastName}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className={clsx("whitespace-break-spaces")}>
              <li>{client.email}</li>
              <li>{client.phone}</li>
              {isDetail && (
                <div>
                  {client.Payment.map((APayment: Payment) => (
                    <div key={APayment.id}>
                      <li>{APayment.amount}</li>
                      <li>{APayment.status}</li>
                      <li>{APayment.membership}</li>
                    </div>
                  ))}
                </div>
              )}
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
