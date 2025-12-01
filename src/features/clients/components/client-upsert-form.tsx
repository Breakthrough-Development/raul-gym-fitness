"use client";
import { EmailField } from "@/components/form/fields/emailField";
import { FirstNameField } from "@/components/form/fields/firstNameField";
import { LastNameField } from "@/components/form/fields/lastNameField";
import { PhoneField } from "@/components/form/fields/phoneField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { upsertClient } from "../actions/upsert-client";

type ClientUpsertFormProps = {
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
      <FirstNameField
        actionState={actionState}
        defaultValue={client?.firstName}
      />
      <LastNameField
        isOptional={true}
        actionState={actionState}
        defaultValue={client?.lastName as string}
      />
      <PhoneField
        isOptional={true}
        actionState={actionState}
        defaultValue={client?.phone as string}
      />
      <EmailField
        isOptional={true}
        actionState={actionState}
        defaultValue={client?.email as string}
      />
      <SubmitButton label={client ? "Editar" : "Crear"} />
      {actionState.message}
    </Form>
  );
};
