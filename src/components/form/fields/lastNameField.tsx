import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import { ActionState } from "../util/to-action-state";

export type LastNameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
};
export const LastNameField = ({
  actionState,
  isOptional = false,
  defaultValue,
}: LastNameFieldProps) => {
  return (
    <>
      <Label htmlFor="lastName" className="text-base md:text-lg">
        Apellido {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Apellido"
        defaultValue={
          (actionState.payload?.get("lastName") as string) || defaultValue
        }
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="lastName" />
    </>
  );
};
