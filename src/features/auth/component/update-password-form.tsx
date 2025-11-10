"use client";

import { DynamicPasswordField } from "@/components/form/fields/dynamic-fields/DynamicPasswordField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { useActionState } from "react";
import { resetPassword } from "../actions/update-password";

export const ResetPasswordForm = () => {
  const [actionState, action] = useActionState(
    resetPassword,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <DynamicPasswordField
        actionState={actionState}
        name="currentPassword"
        autoComplete="current-password"
        defaultValue={actionState.payload?.get("currentPassword") as string}
        placeholder="Contraseña actual"
        label="Contraseña actual"
        data-testid="current-password"
      />
      <DynamicPasswordField
        actionState={actionState}
        name="newPassword"
        autoComplete="new-password"
        defaultValue={actionState.payload?.get("newPassword") as string}
        placeholder="Nueva contraseña"
        label="Nueva contraseña"
        data-testid="new-password"
      />
      <DynamicPasswordField
        actionState={actionState}
        name="confirmPassword"
        autoComplete="new-password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
        placeholder="Confirmar contraseña"
        label="Confirmar contraseña"
        data-testid="confirm-password"
      />
      <div className="flex flex-row flex-wrap justify-between w-full">
        <SubmitButton label="Actualizar contraseña" />
      </div>
    </Form>
  );
};
