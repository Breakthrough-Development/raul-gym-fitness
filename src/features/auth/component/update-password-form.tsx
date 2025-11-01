"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { useActionState } from "react";
import { resetPassword } from "../actions/update-password";

export const ResetPasswordForm = () => {
  const [actionState, action] = useActionState(
    resetPassword,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      
      <PasswordInput
        type="password"
        name="currentPassword"
        placeholder="Contraseña actual"
        defaultValue={actionState.payload?.get("currentPassword") as string}
        autoComplete="current-password"
      />
      <FieldError actionState={actionState} name="currentPassword" />

      <PasswordInput
        type="password"
        name="newPassword"
        placeholder="Nueva contraseña"
        defaultValue={actionState.payload?.get("newPassword") as string}
        autoComplete="new-password"
      />
      <FieldError actionState={actionState} name="newPassword" />

      <PasswordInput
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
