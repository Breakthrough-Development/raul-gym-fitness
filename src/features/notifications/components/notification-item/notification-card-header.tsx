"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { LucideMessageSquare } from "lucide-react";
import {
  NOTIFICATION_STATUS_COLORS,
  NOTIFICATION_STATUS_LABELS,
} from "../../constants";

type NotificationCardHeaderProps = {
  message: string;
  status: string;
};

export const NotificationCardHeader = ({
  message,
  status,
}: NotificationCardHeaderProps) => {
  const statusLabel =
    NOTIFICATION_STATUS_LABELS[
      status as keyof typeof NOTIFICATION_STATUS_LABELS
    ];
  const statusColor =
    NOTIFICATION_STATUS_COLORS[
      status as keyof typeof NOTIFICATION_STATUS_COLORS
    ] ?? "text-gray-600";

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span
          className="flex items-center gap-x-2"
          data-testid="notification-message"
        >
          <LucideMessageSquare className="h-4 w-4" />
          {message}
        </span>
        <span
          className={clsx("text-sm font-medium", statusColor)}
          data-testid="notification-status"
        >
          {statusLabel}
        </span>
      </CardTitle>
    </CardHeader>
  );
};
