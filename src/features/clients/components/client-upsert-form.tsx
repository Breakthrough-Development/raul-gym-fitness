"use client";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { upsertClient } from "../actions/upsert-client";

export type ClientUpsertFormProps = {
  client?: Client;
};

export const ClientUpsertForm = ({ client }: ClientUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertClient.bind(null, client?.id),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Label htmlFor="firstName">Nombre</Label>
      <Input
        id="firstName"
        name="firstName"
        type="text"
        defaultValue={
          (actionState.payload?.get("firstName") as string) ?? client?.firstName
        }
      />
      <FieldError actionState={actionState} name="firstName" />

      <Label htmlFor="lastName">Apellido</Label>
      <Input
        id="lastName"
        name="lastName"
        defaultValue={
          (actionState.payload?.get("lastName") as string) ?? client?.lastName
        }
      />
      <FieldError actionState={actionState} name="lastName" />

      <Label htmlFor="phone">Teléfono</Label>
      <Input
        id="phone"
        name="phone"
        defaultValue={
          (actionState.payload?.get("phone") as string) ?? client?.phone
        }
      />
      <FieldError actionState={actionState} name="phone" />

      <Label htmlFor="email">Correo electrónico</Label>
      <Input
        id="email"
        name="email"
        defaultValue={
          (actionState.payload?.get("email") as string) ?? client?.email
        }
      />
      <FieldError actionState={actionState} name="email" />

      <SubmitButton label={client ? "Editar" : "Crear"} />

      {actionState.message}
    </Form>
  );
};
