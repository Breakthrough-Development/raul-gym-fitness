"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketEditPath, ticketPath } from "@/paths";
import { Payment } from "@prisma/client";
import clsx from "clsx";
import { LucidePencil, LucideSquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { ClientWithMetadata } from "../types";

export type ClientItemProps = {
  client: ClientWithMetadata;
  isDetail?: boolean;
};

export const ClientItem = ({ client, isDetail }: ClientItemProps) => {
  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketPath(client.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
        <span className="sr-only">View ticket {client.id}</span>
      </Link>
    </Button>
  );

  const editButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketEditPath(client.id)}>
        <LucidePencil className="h-4 w-4" />
        <span className="sr-only">Edit ticket {client.id}</span>
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
              <div
                className={clsx({
                  "line-clamp-3": !isDetail,
                })}
              >
                {client.Payment.map((APayment: Payment) => (
                  <div key={APayment.id}>
                    <li>{APayment.amount}</li>
                    <li>{APayment.status}</li>
                    <li>{APayment.membership}</li>
                  </div>
                ))}
              </div>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>{editButton}</>
          ) : (
            <>
              {detailButton}
              {editButton}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
