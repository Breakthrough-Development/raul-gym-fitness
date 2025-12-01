import { DatePicker } from "@/components/date-picker";
import { FieldError } from "@/components/form/field-error";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RECURRENCE_OPTIONS } from "@/features/notifications/constants";
import { NotificationWithClients } from "@/features/notifications/types";
import type { ActionState } from "@/types/action-state";

type SchedulingSectionProps = {
  notification?: NotificationWithClients;
  actionState: ActionState;
};

export const SchedulingSection = ({
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
