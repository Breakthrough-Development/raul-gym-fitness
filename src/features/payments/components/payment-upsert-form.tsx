"use client";
import { CurrencyInput } from "@/components/currency-input";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDollarAndCent } from "@/utils/currency";
import { Client, MembershipStatus, Payment } from "@prisma/client";
import { useActionState } from "react";
import { upsertPayment } from "../actions/upsert-payment";
export type PaymentUpsertFormProps = {
  payment?: Payment;
  clients: Client[];
};

export const PaymentUpsertForm = ({
  payment,
  clients,
}: PaymentUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertPayment.bind(null, payment?.id),
    EMPTY_ACTION_STATE
  );

  const membershipStatus = Object.values(MembershipStatus);

  const membershipDefaultValue = () => {
    if (actionState.payload?.get("membership") as string) {
      return actionState.payload?.get("membership") as string;
    }
    if (payment?.membership) {
      return payment?.membership;
    }
    return MembershipStatus.MONTHLY;
  };

  const amountDefaultValue = () => {
    if (actionState.payload?.get("amount") as string) {
      return actionState.payload?.get("amount") as string;
    }
    if (payment?.amount) {
      return toDollarAndCent(payment.amount);
    }
    return "";
  };

  return (
    <Form action={formAction} actionState={actionState}>
      <div className="flex gap-x-2 mb-1">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select
            name="clientId"
            defaultValue={
              (actionState.payload?.get("clientId") as string) ??
              payment?.clientId
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Clients</SelectLabel>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError actionState={actionState} name="clientId" />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="membership">Membership</Label>
          <Select name="membership" defaultValue={membershipDefaultValue()}>
            <SelectTrigger>
              <SelectValue placeholder="Select a membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Membership</SelectLabel>
                {membershipStatus.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError actionState={actionState} name="membership" />
        </div>
      </div>
      <CurrencyInput
        actionState={actionState}
        name="amount"
        defaultValue={payment?.amount}
      />

      <SubmitButton label={payment ? "Edit" : "Create"} />

      {actionState.message}
    </Form>
  );
};
