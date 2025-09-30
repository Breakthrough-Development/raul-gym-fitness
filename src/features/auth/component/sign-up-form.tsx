"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordField } from "@/components/password-field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { signUp } from "../actions/sign-up";

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
        name="firstName"
        placeholder="First Name"
        defaultValue={actionState.payload?.get("firstName") as string}
      />
      <FieldError actionState={actionState} name="firstName" />

      <Input
        name="lastName"
        placeholder="Last Name"
        defaultValue={actionState.payload?.get("lastName") as string}
      />
      <FieldError actionState={actionState} name="lastName" />

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
