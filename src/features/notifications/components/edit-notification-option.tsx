"use client";

import { FormDialog } from "@/components/form-dialog";
import { LucideEdit } from "lucide-react";
import { NotificationWithClients } from "../types";
import { NotificationUpsertForm } from "./notification-upsert-form";

export type EditNotificationOptionProps = {
  notification: NotificationWithClients;
};

export const EditNotificationOption = ({
  notification,
}: EditNotificationOptionProps) => {
  return (
    <FormDialog
      title="Edit Notification"
      description="Update the notification details"
      trigger={
        <div className="flex items-center gap-x-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent">
          <LucideEdit className="h-4 w-4" />
          Edit
        </div>
      }
    >
      <NotificationUpsertForm notification={notification} />
    </FormDialog>
  );
};
