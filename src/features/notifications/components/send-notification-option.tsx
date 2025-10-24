"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { LucideSend } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";
import { sendNotification } from "../actions/send-notification";
import { NotificationWithClients } from "../types";

export type SendNotificationOptionProps = {
  notification: NotificationWithClients;
};

export const SendNotificationOption = ({
  notification,
}: SendNotificationOptionProps) => {
  const [actionState, formAction] = useActionState(
    sendNotification.bind(null, notification.id),
    EMPTY_ACTION_STATE
  );

  const handleSend = async () => {
    const formData = new FormData();
    const result = await formAction(formData);

    if (result?.success) {
      toast.success(
        `Notification sent successfully! Sent to ${result.sentCount} clients${
          result.failedCount > 0 ? `, ${result.failedCount} failed` : ""
        }`
      );
    } else {
      toast.error(result?.error || "Failed to send notification");
    }
  };

  return (
    <div
      className="flex items-center gap-x-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
      onClick={handleSend}
    >
      <LucideSend className="h-4 w-4" />
      Send Now
    </div>
  );
};
