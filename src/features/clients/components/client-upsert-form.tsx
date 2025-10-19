"use client";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PhoneInput } from "@/components/phone-input";
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
        placeholder="Royer"
        type="text"
        defaultValue={
          (actionState.payload?.get("firstName") as string) ?? client?.firstName
        }
      />
      <FieldError actionState={actionState} name="firstName" />

      <Label htmlFor="lastName">Apellido (opcional)</Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Adames"
        defaultValue={
          (actionState.payload?.get("lastName") as string) ?? client?.lastName
        }
      />
      <FieldError actionState={actionState} name="lastName" />

      <PhoneInput
        label="Teléfono (opcional)"
        actionState={actionState}
        name="phone"
        placeholder="(123) 456-7890"
        defaultValue={
          (actionState.payload?.get("phone") as string) ?? client?.phone
        }
      />

      <Label htmlFor="email">Correo electrónico (opcional)</Label>
      <Input
        id="email"
        name="email"
        placeholder="RoyerAAdames@gmail.com"
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
