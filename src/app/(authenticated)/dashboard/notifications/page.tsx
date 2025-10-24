import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { NotificationUpsertForm } from "@/features/notifications/components/notification-upsert-form";
import { parseNotificationSearchParams } from "@/features/notifications/search-params";
import { LucidePlus } from "lucide-react";

export type NotificationsPageProps = {
  searchParams: Promise<URLSearchParams>;
};

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedSearchParams =
    parseNotificationSearchParams(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send WhatsApp notifications to your clients
          </p>
        </div>

        <FormDialog
          title="Create Notification"
          description="Set up a new WhatsApp notification to send to your clients"
          trigger={
            <Button>
              <LucidePlus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          }
        >
          <NotificationUpsertForm />
        </FormDialog>
      </header>

      <NotificationList searchParams={parsedSearchParams} />
    </div>
  );
}
