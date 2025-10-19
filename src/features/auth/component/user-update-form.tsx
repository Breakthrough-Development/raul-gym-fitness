"use client";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { updateUser } from "../actions/update-user";

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
  const [actionState, action] = useActionState(updateUser, EMPTY_ACTION_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const handleAction = (formData: FormData) => {
    setIsEditing(false);
    action(formData);
  };

  useEffect(() => {
    if (actionState.status === "ERROR") {
      setIsEditing(true);
    }
  }, [actionState]);

  return (
    <Form action={handleAction} actionState={actionState}>
      <fieldset disabled={!isEditing} className="flex flex-col gap-y-2">
        <Input
          name="username"
          placeholder="Nombre de usuario"
          defaultValue={
            (actionState.payload?.get("username") as string) || username
          }
          disabled={!isEditing}
        />
        <FieldError actionState={actionState} name="username" />

        <Input
          name="firstName"
          placeholder="Nombre"
          defaultValue={
            (actionState.payload?.get("firstName") as string) || firstName
          }
          disabled={!isEditing}
        />
        <FieldError actionState={actionState} name="firstName" />

        <Input
          name="lastName"
          placeholder="Apellido"
          defaultValue={
            (actionState.payload?.get("lastName") as string) || lastName
          }
          disabled={!isEditing}
        />
        <FieldError actionState={actionState} name="lastName" />

        <Input
          name="email"
          placeholder="Correo electrónico"
          defaultValue={(actionState.payload?.get("email") as string) || email}
          disabled={!isEditing}
        />
        <FieldError actionState={actionState} name="email" />

        <PhoneInput
          actionState={actionState}
          name="phone"
          defaultValue={(actionState.payload?.get("phone") as string) || phone}
        />
        <FieldError actionState={actionState} name="phone" />
      </fieldset>

      <div className="flex flex-row gap-2">
        <SubmitButton
          label="Actualizar usuario"
          variant="outline"
          disabled={!isEditing}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => setIsEditing((state) => !state)}
        >
          {isEditing ? "Desactivar edición" : "Editar"}
        </Button>
      </div>
    </Form>
  );
};
