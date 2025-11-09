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
  onSuccess?: (actionState: unknown) => void;
  formAction?: (formData: FormData) => void;
  onSubmit?: (formData: FormData) => Promise<void>;
};

export const ClientUpsertForm = ({
  client,
  onSuccess,
  formAction: customFormAction,
  onSubmit,
}: ClientUpsertFormProps) => {
  const [actionState, defaultFormAction] = useActionState(
    upsertClient.bind(null, client?.id),
    EMPTY_ACTION_STATE
  );

  const formAction = customFormAction || defaultFormAction;

  // If onSubmit is provided, create a wrapper that calls it
  const handleSubmit = onSubmit
    ? async (formData: FormData) => {
        await onSubmit(formData);
        // Call onSuccess if provided
        if (onSuccess) {
          onSuccess({ status: "SUCCESS" });
        }
      }
    : undefined;

  return (
    <Form
      action={handleSubmit || formAction}
      actionState={actionState}
      onSuccess={handleSubmit ? undefined : onSuccess}
    >
      <Label htmlFor="firstName" className="text-base md:text-lg">
        Nombre
      </Label>
      <Input
        id="firstName"
        name="firstName"
        placeholder="Royer"
        type="text"
        defaultValue={
          (actionState.payload?.get("firstName") as string) ?? client?.firstName
        }
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="firstName" />

      <Label htmlFor="lastName" className="text-base md:text-lg">
        Apellido (opcional)
      </Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Adames"
        defaultValue={
          (actionState.payload?.get("lastName") as string) ?? client?.lastName
        }
        className="text-base md:text-lg"
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

      <Label htmlFor="email" className="text-base md:text-lg">
        Correo electrónico (opcional)
      </Label>
      <Input
        id="email"
        name="email"
        placeholder="royeraadames@gmail.com"
        defaultValue={
          (actionState.payload?.get("email") as string) ?? client?.email
        }
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="email" />

      <SubmitButton label={client ? "Editar" : "Crear"} />

      {actionState.message}
    </Form>
  );
};
