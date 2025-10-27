"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PasswordField } from "@/components/password-field";
import { PhoneInput } from "@/components/phone-input";
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

          <Input
            name="email"
            placeholder="Correo electrónico"
            defaultValue={actionState.payload?.get("email") as string}
            className="text-base md:text-lg"
          />
          <FieldError actionState={actionState} name="email" />

          <PhoneInput
            actionState={actionState}
            name="phone"
            defaultValue={actionState.payload?.get("phone") as string}
          />
          <FieldError actionState={actionState} name="phone" />
          <PasswordField
            type="password"
            name="password"
            placeholder="Contraseña"
            defaultValue={actionState.payload?.get("password") as string}
            autoComplete="new-password"
          />
          <FieldError actionState={actionState} name="password" />

          <PasswordField
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
