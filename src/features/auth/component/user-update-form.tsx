"use client";

import { EmailField } from "@/components/form/fields/emailField";
import { FirstNameField } from "@/components/form/fields/firstNameField";
import { LastNameField } from "@/components/form/fields/lastNameField";
import { PhoneField } from "@/components/form/fields/phoneField";
import { UsernameField } from "@/components/form/fields/usernameField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { updateUser } from "../actions/update-user";
import { useEditableForm } from "../hooks/use-editable-form";

type UserUpdateFormProps = {
  lastName: string;
  firstName: string;
  username: string;
  email?: string;
  phone?: string;
};

export const UserUpdateForm = ({
  lastName,
  firstName,
  username,
  email = "",
  phone = "",
}: UserUpdateFormProps) => {
  const { actionState, isEditing, toggleEditing, handleAction } =
    useEditableForm({
      action: updateUser,
    });

  return (
    <Form action={handleAction} actionState={actionState}>
      <fieldset disabled={!isEditing} className="flex flex-col gap-y-2">
        <UsernameField
          actionState={actionState}
          defaultValue={username}
          disabled={!isEditing}
        />

        <FirstNameField
          actionState={actionState}
          defaultValue={firstName}
          disabled={!isEditing}
        />

        <LastNameField
          actionState={actionState}
          defaultValue={lastName}
          disabled={!isEditing}
        />

        <EmailField
          actionState={actionState}
          defaultValue={email}
          disabled={!isEditing}
        />

        <PhoneField
          actionState={actionState}
          defaultValue={phone as string}
          disabled={!isEditing}
        />
      </fieldset>

      <div className="flex flex-row gap-2">
        <SubmitButton
          label="Actualizar usuario"
          variant="outline"
          disabled={!isEditing}
        />
        <Button type="button" variant="default" onClick={toggleEditing}>
          {isEditing ? "Desactivar edición" : "Editar"}
        </Button>
      </div>
    </Form>
  );
};
