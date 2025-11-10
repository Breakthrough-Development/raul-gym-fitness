"use client";

import { DeleteOption } from "@/components/delete-payment-option";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { format } from "date-fns";
import {
  LucideCalendar,
  LucideMessageSquare,
  LucideMoreHorizontal,
  LucideRepeat,
  LucideUsers,
} from "lucide-react";
import { deleteNotification } from "../actions/delete-notification";
import {
  MEMBERSHIP_FILTER_OPTIONS,
  NOTIFICATION_STATUS_LABELS,
  RECIPIENT_TYPE_OPTIONS,
  RECURRENCE_OPTIONS,
} from "../constants";
import { NotificationWithClients } from "../types";
import { EditNotificationOption } from "./edit-notification-option";
import { SendNotificationOption } from "./send-notification-option";

export type NotificationItemProps = {
  notification: NotificationWithClients;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const recipientTypeLabel = RECIPIENT_TYPE_OPTIONS.find(
    (option) => option.value === notification.recipientType
  )?.label;

  const membershipFilterLabel = MEMBERSHIP_FILTER_OPTIONS.find(
    (option) => option.value === notification.membershipFilter
  )?.label;

  const recurrenceLabel = RECURRENCE_OPTIONS.find(
    (option) => option.value === notification.recurrence
  )?.label;

  const statusLabel =
    NOTIFICATION_STATUS_LABELS[
      notification.status as keyof typeof NOTIFICATION_STATUS_LABELS
    ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "SENT":
        return "text-green-600";
      case "FAILED":
        return "text-red-600";
      case "CANCELLED":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-full max-w-[580px]" data-testid="notification-item">
      <div className="flex gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-x-2" data-testid="notification-message">
                <LucideMessageSquare className="h-4 w-4" />
                {notification.message}
              </span>
              <span
                className={clsx(
                  "text-sm font-medium",
                  getStatusColor(notification.status)
                )}
                data-testid="notification-status"
              >
                {statusLabel}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="whitespace-break-spaces flex flex-col gap-y-2">
              <li className="flex items-center gap-x-2">
                <LucideUsers className="h-4 w-4 text-muted-foreground" />
                <span>
                  {recipientTypeLabel}
                  {notification.membershipFilter &&
                    ` • ${membershipFilterLabel}`}
                  {notification.clients && notification.clients.length > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({notification.clients.length} clientes)
                    </span>
                  )}
                </span>
              </li>

              <li className="flex items-center gap-x-2">
                <LucideCalendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(notification.sendDate), "PPP 'at' p")}
                </span>
              </li>

              <li className="flex items-center gap-x-2">
                <LucideRepeat className="h-4 w-4 text-muted-foreground" />
                <span>{recurrenceLabel}</span>
              </li>

              <li className="flex items-center gap-x-2">
                <LucideMessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">
                  {notification.templateName}
                </span>
              </li>

              {notification.sentAt && (
                <li className="flex items-center gap-x-2">
                  <span className="text-muted-foreground text-sm">
                    Enviado:{" "}
                    {format(new Date(notification.sentAt), "PPP 'at' p")}
                  </span>
                </li>
              )}

              {notification.error && (
                <li className="flex items-center gap-x-2">
                  <span className="text-red-600 text-sm">
                    Error: {notification.error}
                  </span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-y-1 items-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" data-testid="notification-menu-button">
                <span className="sr-only">Open menu</span>
                <LucideMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <EditNotificationOption notification={notification} />
              {notification.status === "PENDING" && (
                <SendNotificationOption notification={notification} />
              )}
              <DeleteOption id={notification.id} action={deleteNotification} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
