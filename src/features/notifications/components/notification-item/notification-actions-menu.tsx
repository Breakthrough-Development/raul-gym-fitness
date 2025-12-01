"use client";

import { DeleteOption } from "@/components/delete-payment-option";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideMoreHorizontal } from "lucide-react";
import { deleteNotification } from "../../actions/delete-notification";
import { NotificationWithClients } from "../../types";
import { EditNotificationOption } from "../edit-notification-option";
import { SendNotificationOption } from "../send-notification-option";

type NotificationActionsMenuProps = {
  notification: NotificationWithClients;
};

export const NotificationActionsMenu = ({
  notification,
}: NotificationActionsMenuProps) => {
  return (
    <div className="flex flex-col gap-y-1 items-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            data-testid="notification-menu-button"
          >
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
  );
};
