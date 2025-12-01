"use client";

import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Separator } from "@/components/ui/separator";
import { useNotificationForm } from "../hooks/use-notification-form";
import { NotificationWithClients } from "../types";
import { BasicInfoSection } from "./form/basic-info-section";
import { RecipientsSection } from "./form/recipients-section";
import { SchedulingSection } from "./form/scheduling-section";

type NotificationUpsertFormProps = {
  notification?: NotificationWithClients;
};

export const NotificationUpsertForm = ({
  notification,
}: NotificationUpsertFormProps) => {
  const {
    actionState,
    formAction,
    templates,
    clients,
    selectedClients,
    recipientType,
    membershipFilter,
    setMembershipFilter,
    handleRecipientTypeChange,
    handleClientSelection,
  } = useNotificationForm(notification);

  return (
    <Form action={formAction} actionState={actionState}>
      <div className="space-y-6">
        <BasicInfoSection
          notification={notification}
          actionState={actionState}
          templates={templates}
        />

        <Separator />

        <RecipientsSection
          recipientType={recipientType}
          onRecipientTypeChange={handleRecipientTypeChange}
          membershipFilter={membershipFilter}
          onMembershipFilterChange={setMembershipFilter}
          clients={clients}
          selectedClients={selectedClients}
          onClientSelection={handleClientSelection}
        />

        <Separator />

        <SchedulingSection
          notification={notification}
          actionState={actionState}
        />

        {/* Hidden fields for form submission */}
        <input type="hidden" name="recipientType" value={recipientType} />
        <input
          type="hidden"
          name="selectedClientIds"
          value={JSON.stringify(selectedClients)}
        />
        <input
          type="hidden"
          name="membershipFilter"
          value={membershipFilter || "all"}
        />

        <SubmitButton label={notification ? "Update" : "Create"} />
        {actionState.status === "ERROR" && actionState.message}
      </div>
    </Form>
  );
};
