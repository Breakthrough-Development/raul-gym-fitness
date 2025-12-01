"use client";

import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  LucideCalendar,
  LucideMessageSquare,
  LucideRepeat,
  LucideUsers,
} from "lucide-react";
import {
  getOptionLabel,
  MEMBERSHIP_FILTER_OPTIONS,
  RECIPIENT_TYPE_OPTIONS,
  RECURRENCE_OPTIONS,
} from "../../constants";
import { NotificationWithClients } from "../../types";

type NotificationCardContentProps = {
  notification: NotificationWithClients;
};

export const NotificationCardContent = ({
  notification,
}: NotificationCardContentProps) => {
  const recipientTypeLabel = getOptionLabel(
    RECIPIENT_TYPE_OPTIONS,
    notification.recipientType
  );
  const membershipFilterLabel = getOptionLabel(
    MEMBERSHIP_FILTER_OPTIONS,
    notification.membershipFilter
  );
  const recurrenceLabel = getOptionLabel(
    RECURRENCE_OPTIONS,
    notification.recurrence
  );

  return (
    <CardContent>
      <ul className="whitespace-break-spaces flex flex-col gap-y-2">
        <li className="flex items-center gap-x-2">
          <LucideUsers className="h-4 w-4 text-muted-foreground" />
          <span>
            {recipientTypeLabel}
            {notification.membershipFilter && ` • ${membershipFilterLabel}`}
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
          <span>{format(new Date(notification.sendDate), "PPP 'at' p")}</span>
        </li>

        <li className="flex items-center gap-x-2">
          <LucideRepeat className="h-4 w-4 text-muted-foreground" />
          <span>{recurrenceLabel}</span>
        </li>

        <li className="flex items-center gap-x-2">
          <LucideMessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{notification.templateName}</span>
        </li>

        {notification.sentAt && (
          <li className="flex items-center gap-x-2">
            <span className="text-muted-foreground text-sm">
              Enviado: {format(new Date(notification.sentAt), "PPP 'at' p")}
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
  );
};
