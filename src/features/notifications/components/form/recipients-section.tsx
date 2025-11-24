import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembershipFilter, RecipientType } from "@prisma/client";
import {
  MEMBERSHIP_FILTER_OPTIONS,
  RECIPIENT_TYPE_OPTIONS,
} from "@/features/notifications/constants";

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

export const RecipientsSection = ({
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

