"use client";

import { DatePicker } from "@/components/date-picker";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { ActionState } from "@/components/form/util/to-action-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { WhatsAppTemplate } from "@/lib/whatsapp";
import { MembershipFilter, RecipientType } from "@prisma/client";
import {
  MEMBERSHIP_FILTER_OPTIONS,
  RECIPIENT_TYPE_OPTIONS,
  RECURRENCE_OPTIONS,
} from "../constants";
import { useNotificationForm } from "../hooks/use-notification-form";
import { NotificationWithClients } from "../types";

export type NotificationUpsertFormProps = {
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

// Co-located Helper Components

type BasicInfoSectionProps = {
  notification?: NotificationWithClients;
  actionState: ActionState;
  templates: WhatsAppTemplate[];
};

const BasicInfoSection = ({
  notification,
  actionState,
  templates,
}: BasicInfoSectionProps) => (
  <div className="space-y-4">
    <Label htmlFor="message" className="text-base md:text-lg">
      Message Description
    </Label>
    <Input
      id="message"
      name="message"
      placeholder="e.g., Monthly membership reminder"
      defaultValue={notification?.message || ""}
      className="text-base md:text-lg"
      data-testid="notification-form-message-input"
    />
    <FieldError actionState={actionState} name="message" />

    <Label htmlFor="templateName" className="text-base md:text-lg">
      WhatsApp Template
    </Label>
    {templates.length === 0 ? (
      <div className="space-y-2">
        <Input
          id="templateName"
          name="templateName"
          placeholder="Enter template name (e.g., membership_reminder)"
          defaultValue={notification?.templateName || ""}
          className="text-base md:text-lg"
          data-testid="notification-form-template-input"
        />
        <p className="text-base text-muted-foreground md:text-lg">
          No templates available from WhatsApp API. Enter template name
          manually.
        </p>
      </div>
    ) : (
      <Select
        name="templateName"
        defaultValue={notification?.templateName || undefined}
      >
        <SelectTrigger className="text-base md:text-lg">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.name} value={template.name}>
              {template.name} ({template.language})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
    <FieldError actionState={actionState} name="templateName" />
  </div>
);

type RecipientsSectionProps = {
  recipientType: RecipientType;
  onRecipientTypeChange: (value: RecipientType) => void;
  membershipFilter: MembershipFilter | null;
  onMembershipFilterChange: (value: MembershipFilter | null) => void;
  clients: Array<{
    id: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
  }>;
  selectedClients: string[];
  onClientSelection: (clientId: string, checked: boolean) => void;
};

const RecipientsSection = ({
  recipientType,
  onRecipientTypeChange,
  membershipFilter,
  onMembershipFilterChange,
  clients,
  selectedClients,
  onClientSelection,
}: RecipientsSectionProps) => (
  <div className="space-y-4">
    <Label className="text-base md:text-lg">Recipients</Label>

    <Select value={recipientType} onValueChange={onRecipientTypeChange}>
      <SelectTrigger
        className="text-base md:text-lg"
        data-testid="notification-form-recipient-select"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {RECIPIENT_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {recipientType === RecipientType.ALL && (
      <div className="space-y-2">
        <Label className="text-base md:text-lg">
          Filter by Membership Type (Optional)
        </Label>
        <Select
          value={membershipFilter || ""}
          onValueChange={(value) =>
            onMembershipFilterChange(value as MembershipFilter | null)
          }
        >
          <SelectTrigger className="text-base md:text-lg">
            <SelectValue placeholder="All memberships" />
          </SelectTrigger>
          <SelectContent>
            {MEMBERSHIP_FILTER_OPTIONS.map((option) => (
              <SelectItem
                key={option.value || "all"}
                value={option.value || "all"}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    {recipientType === RecipientType.SELECTED && (
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Select Individual Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center space-x-2">
              <Checkbox
                id={`client-${client.id}`}
                checked={selectedClients.includes(client.id)}
                onCheckedChange={(checked) =>
                  onClientSelection(client.id, checked as boolean)
                }
              />
              <label
                htmlFor={`client-${client.id}`}
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-lg"
              >
                {client.firstName} {client.lastName}
                {!client.phone && (
                  <span className="text-muted-foreground ml-1">(no phone)</span>
                )}
              </label>
            </div>
          ))}
          {clients.length === 0 && (
            <p className="text-base text-muted-foreground md:text-lg">
              No clients found
            </p>
          )}
        </CardContent>
      </Card>
    )}
  </div>
);

type SchedulingSectionProps = {
  notification?: NotificationWithClients;
  actionState: ActionState;
};

const SchedulingSection = ({
  notification,
  actionState,
}: SchedulingSectionProps) => (
  <div className="space-y-4">
    <Label className="text-base md:text-lg">Send Date</Label>
    <DatePicker
      id="sendDate"
      name="sendDate"
      defaultValue={
        notification?.sendDate
          ? new Date(notification.sendDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      }
    />
    <FieldError actionState={actionState} name="sendDate" />

    <Label htmlFor="recurrence" className="text-base md:text-lg">
      Recurrence
    </Label>
    <Select
      name="recurrence"
      defaultValue={notification?.recurrence || "ONE_TIME"}
    >
      <SelectTrigger
        className="text-base md:text-lg"
        data-testid="notification-form-recurrence-select"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {RECURRENCE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FieldError actionState={actionState} name="recurrence" />
  </div>
);
