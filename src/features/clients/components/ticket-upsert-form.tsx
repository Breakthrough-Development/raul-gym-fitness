"use client";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { User } from "@prisma/client";
import { useActionState } from "react";

export type ClientUpsertFormProps = {
  user?: User;
};

export const ClientUpsertForm = ({ user }: ClientUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertTicket.bind(null, user?.id),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Label htmlFor="firstName">First Name</Label>
      <Input
        id="firstName"
        name="firstName"
        type="text"
        defaultValue={
          (actionState.payload?.get("firstName") as string) ?? user?.firstName
        }
      />
      <FieldError actionState={actionState} name="firstName" />

      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        name="lastName"
        defaultValue={
          (actionState.payload?.get("lastName") as string) ?? user?.lastName
        }
      />
      <FieldError actionState={actionState} name="lastName" />

      <Label htmlFor="phone">Phone</Label>
      <Input
        id="phone"
        name="phone"
        defaultValue={
          (actionState.payload?.get("phone") as string) ?? user?.phone
        }
      />
      <FieldError actionState={actionState} name="phone" />

      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        defaultValue={
          (actionState.payload?.get("email") as string) ?? user?.email
        }
      />
      <FieldError actionState={actionState} name="email" />

      <SubmitButton label={user ? "Edit" : "Create"} />

      {actionState.message}
    </Form>
  );
};
