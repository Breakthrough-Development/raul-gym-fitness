"use client";

import { ConfirmPasswordField } from "@/components/form/fields/confirmPasswordField";
import { CurrentPasswordField } from "@/components/form/fields/currentPasswordField";
import { NewPasswordField } from "@/components/form/fields/newPasswordField";
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
      <CurrentPasswordField actionState={actionState} />
      <NewPasswordField actionState={actionState} />
      <ConfirmPasswordField actionState={actionState} />
      <div className="flex flex-row flex-wrap justify-between w-full">
        <SubmitButton label="Actualizar contraseña" />
      </div>
    </Form>
  );
};
