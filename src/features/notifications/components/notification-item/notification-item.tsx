"use client";

import { Card } from "@/components/ui/card";
import { NotificationWithClients } from "../../types";
import { NotificationActionsMenu } from "./notification-actions-menu";
import { NotificationCardContent } from "./notification-card-content";
import { NotificationCardHeader } from "./notification-card-header";

type NotificationItemProps = {
  notification: NotificationWithClients;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <div className="w-full max-w-[580px]" data-testid="notification-item">
      <div className="flex gap-x-2">
        <Card className="w-full">
          <NotificationCardHeader
            message={notification.message}
            status={notification.status}
          />
          <NotificationCardContent notification={notification} />
        </Card>
        <NotificationActionsMenu notification={notification} />
      </div>
    </div>
  );
};

