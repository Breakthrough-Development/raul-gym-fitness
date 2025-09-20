"use client";

import { signUp } from "../actions/sign-up";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <Input name="username" placeholder="Username" />
      <FieldError actionState={actionState} name="username" />

      <Input name="email" placeholder="Email" />
      <FieldError actionState={actionState} name="email" />

      <Input type="password" name="password" placeholder="Password" />
      <FieldError actionState={actionState} name="password" />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export { SignUpForm };
