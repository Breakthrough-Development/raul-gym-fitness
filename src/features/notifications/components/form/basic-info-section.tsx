import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppTemplate } from "@/lib/whatsapp";
import { NotificationWithClients } from "@/features/notifications/types";
import { ActionState } from "@/components/form/util/to-action-state";

type BasicInfoSectionProps = {
  notification?: NotificationWithClients;
  actionState: ActionState;
  templates: WhatsAppTemplate[];
};

export const BasicInfoSection = ({
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

