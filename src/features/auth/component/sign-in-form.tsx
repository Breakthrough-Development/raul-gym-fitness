"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordField } from "@/components/password-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signIn } from "../actions/sign-in";
const SignInForm = () => {
  const [actionState, action] = useActionState(signIn, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
       <Label htmlFor="email" className="text-base md:text-lg">
          Correo electrónico
      </Label>
      <Input
        id="email"
        name="email"
        placeholder="Correo electrónico"
        defaultValue={actionState.payload?.get("email") as string}
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="email" />

      <Label htmlFor="password" className="text-base md:text-lg">
        Contraseña
      </Label>
        <PasswordField
        id="password"
        name="password"
        placeholder="Contraseña"
        defaultValue={actionState.payload?.get("password") as string}
        autoComplete="current-password"
      />
      <FieldError actionState={actionState} name="password" />

      <SubmitButton label="Iniciar sesión" />
    </Form>
  );
};

export { SignInForm };
