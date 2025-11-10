"use client";

import { LucideSend } from "lucide-react";
import { toast } from "sonner";
import { sendNotification } from "../actions/send-notification";
import { NotificationWithClients } from "../types";

export type SendNotificationOptionProps = {
  notification: NotificationWithClients;
};

export const SendNotificationOption = ({
  notification,
}: SendNotificationOptionProps) => {
  const handleSend = async () => {
    try {
      const result = await sendNotification(notification.id);

      if (result.status === "SUCCESS") {
        toast.success(result.message || "Notification sent successfully!");
      } else {
        toast.error(result.message || "Failed to send notification");
      }
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <div
      className="flex items-center gap-x-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
      onClick={handleSend}
      data-testid="notification-send-option"
    >
      <LucideSend className="h-4 w-4" />
      Send Now
    </div>
  );
};
