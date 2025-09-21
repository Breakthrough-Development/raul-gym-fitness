"use client";

import { signUp } from "../actions/sign-up";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/password-field";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="username"
        placeholder="Username"
        defaultValue={actionState.payload?.get("username") as string}
      />
      <FieldError actionState={actionState} name="username" />

      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <PasswordField
        type="password"
        name="password"
        placeholder="Password"
        defaultValue={actionState.payload?.get("password") as string}
      />
      <FieldError actionState={actionState} name="password" />

      <PasswordField
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export { SignUpForm };
