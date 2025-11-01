"use client";

import { FieldError } from "@/components/form/field-error";
import { EmailField } from "@/components/form/fields/emailField";
import { PasswordField } from "@/components/form/fields/passwordField";
import { PhoneField } from "@/components/form/fields/phoneField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { signUp } from "../actions/sign-up";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);
  const [secretPhrase, setSecretPhrase] = useState("");
  return (
    <div>
      <Form action={action} actionState={actionState} className=" gap-y-8">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor={"frase-secreta"} className="text-base md:text-lg">
            Por favor ingrese la frase secreta
          </Label>
          <Input
            id={"frase-secreta"}
            name={"frase-secreta"}
            placeholder="Por favor ingrese la frase secreta"
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
            className="text-base md:text-lg"
          />
          <FieldError actionState={actionState} name="frase-secreta" />
        </div>
        <fieldset
          disabled={secretPhrase.length === 0}
          className="flex flex-col gap-y-2"
        >
          <Input
            name="username"
            placeholder="Nombre de usuario"
            defaultValue={actionState.payload?.get("username") as string}
            className="text-base md:text-lg"
          />
          <FieldError actionState={actionState} name="username" />

          <Input
            name="firstName"
            placeholder="Nombre"
            defaultValue={actionState.payload?.get("firstName") as string}
            className="text-base md:text-lg"
          />
          <FieldError actionState={actionState} name="firstName" />

          <Input
            name="lastName"
            placeholder="Apellido"
            defaultValue={actionState.payload?.get("lastName") as string}
            className="text-base md:text-lg"
          />
          <FieldError actionState={actionState} name="lastName" />

          <EmailField actionState={actionState} />
          <PhoneField actionState={actionState} />
          <PasswordField actionState={actionState} />

          <PasswordInput
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            defaultValue={actionState.payload?.get("confirmPassword") as string}
            autoComplete="new-password"
          />
          <FieldError actionState={actionState} name="confirmPassword" />

          <SubmitButton label="Registrarse" />
        </fieldset>
      </Form>
    </div>
  );
};

export { SignUpForm };
