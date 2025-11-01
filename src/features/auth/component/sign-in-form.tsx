"use client";

import { EmailField } from "@/components/form/fields/emailField";
import { PasswordField } from "@/components/form/fields/passwordField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { useActionState } from "react";
import { signIn } from "../actions/sign-in";
const SignInForm = () => {
  const [actionState, action] = useActionState(signIn, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <EmailField actionState={actionState} />
      <PasswordField actionState={actionState} />
      <SubmitButton label="Iniciar sesión" />
    </Form>
  );
};

export { SignInForm };
