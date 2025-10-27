"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordField } from "@/components/password-field";
import { useActionState } from "react";
import { resetPassword } from "../actions/update-password";

export const ResetPasswordForm = () => {
  const [actionState, action] = useActionState(
    resetPassword,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <PasswordField
        type="password"
        name="currentPassword"
        placeholder="Contraseña actual"
        defaultValue={actionState.payload?.get("currentPassword") as string}
        autoComplete="current-password"
      />
      <FieldError actionState={actionState} name="currentPassword" />

      <PasswordField
        type="password"
        name="newPassword"
        placeholder="Nueva contraseña"
        defaultValue={actionState.payload?.get("newPassword") as string}
        autoComplete="new-password"
      />
      <FieldError actionState={actionState} name="newPassword" />

      <PasswordField
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
        autoComplete="new-password"
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <div className="flex flex-row flex-wrap justify-between w-full">
        <SubmitButton label="Actualizar contraseña" />
      </div>
    </Form>
  );
};
