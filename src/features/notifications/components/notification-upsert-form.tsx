"use client";

import { DatePicker } from "@/components/date-picker";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
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
import { useActionState, useEffect, useState } from "react";
import { upsertNotification } from "../actions/upsert-notification";
import {
  MEMBERSHIP_FILTER_OPTIONS,
  RECIPIENT_TYPE_OPTIONS,
  RECURRENCE_OPTIONS,
} from "../constants";
import { getAllClients } from "../queries/get-all-clients";
import { getWhatsAppTemplates } from "../queries/get-whatsapp-templates";
import { NotificationWithClients } from "../types";

export type NotificationUpsertFormProps = {
  notification?: NotificationWithClients;
};

export const NotificationUpsertForm = ({
  notification,
}: NotificationUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertNotification.bind(null, notification?.id),
    EMPTY_ACTION_STATE
  );

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [clients, setClients] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string | null;
      phone: string | null;
    }>
  >([]);
  const [selectedClients, setSelectedClients] = useState<string[]>(
    notification?.selectedClientIds || []
  );
  const [recipientType, setRecipientType] = useState<RecipientType>(
    notification?.recipientType || RecipientType.ALL
  );
  const [membershipFilter, setMembershipFilter] =
    useState<MembershipFilter | null>(notification?.membershipFilter || null);

  // Load WhatsApp templates and clients
  useEffect(() => {
    const loadData = async () => {
      const [fetchedTemplates, fetchedClients] = await Promise.all([
        getWhatsAppTemplates(),
        getAllClients(),
      ]);
      setTemplates(fetchedTemplates);
      setClients(fetchedClients);
    };
    loadData();
  }, []);

  const handleRecipientTypeChange = (value: RecipientType) => {
    setRecipientType(value);
    if (value === RecipientType.ALL) {
      setSelectedClients([]);
    }
  };

  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients((prev) => [...prev, clientId]);
    } else {
      setSelectedClients((prev) => prev.filter((id) => id !== clientId));
    }
  };

  return (
    <Form action={formAction} actionState={actionState}>
      <div className="space-y-6">
        {/* Basic Information */}
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

        <Separator />

        {/* Recipients */}
        <div className="space-y-4">
          <Label className="text-base md:text-lg">Recipients</Label>

          <Select
            value={recipientType}
            onValueChange={handleRecipientTypeChange}
          >
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
                  setMembershipFilter(value as MembershipFilter | null)
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
                        handleClientSelection(client.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`client-${client.id}`}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-lg"
                    >
                      {client.firstName} {client.lastName}
                      {!client.phone && (
                        <span className="text-muted-foreground ml-1">
                          (no phone)
                        </span>
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
        </div>

        <Separator />

        {/* Scheduling */}
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

        <SubmitButton label={notification ? "Update" : "Create"} />
        {actionState.status === "ERROR" && actionState.message}
      </div>
    </Form>
  );
};
