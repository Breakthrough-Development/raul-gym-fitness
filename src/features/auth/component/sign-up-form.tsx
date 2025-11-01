"use client";

import { ConfirmPasswordField } from "@/components/form/fields/confirmPasswordField";
import { DynamicTextField } from "@/components/form/fields/dynamic-fields/DynamicTextField";
import { EmailField } from "@/components/form/fields/emailField";
import { FirstNameField } from "@/components/form/fields/firstNameField";
import { LastNameField } from "@/components/form/fields/lastNameField";
import { PasswordField } from "@/components/form/fields/passwordField";
import { PhoneField } from "@/components/form/fields/phoneField";
import { UsernameField } from "@/components/form/fields/usernameFIeld";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { useActionState, useState } from "react";
import { signUp } from "../actions/sign-up";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);
  const [secretPhrase, setSecretPhrase] = useState("");
  return (
    <div>
      <Form action={action} actionState={actionState} className=" gap-y-8">
        <div className="flex flex-col gap-y-2">
          <DynamicTextField
            actionState={actionState}
            name="frase-secreta"
            placeholder="Por favor ingrese la frase secreta"
            label="Por favor ingrese la frase secreta"
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
          />
        </div>
        <fieldset
          disabled={secretPhrase.length === 0}
          className="flex flex-col gap-y-2"
        >
          <UsernameField actionState={actionState} isOptional={true} />
          <FirstNameField actionState={actionState} isOptional={true} />
          <LastNameField actionState={actionState} isOptional={true} />
          <EmailField actionState={actionState} isOptional={true} />
          <PhoneField actionState={actionState} isOptional={true} />
          <PasswordField actionState={actionState} isOptional={true} />
          <ConfirmPasswordField actionState={actionState} isOptional={true} />
          <SubmitButton label="Registrarse" />
        </fieldset>
      </Form>
    </div>
  );
};

export { SignUpForm };
