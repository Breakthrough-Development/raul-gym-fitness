import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import { ActionState } from "../util/to-action-state";

export type FirstNameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
};
export const FirstNameField = ({
  actionState,
  isOptional = false,
  defaultValue,
}: FirstNameFieldProps) => {
  return (
    <>
      <Label htmlFor="firstName" className="text-base md:text-lg">
        Primer nombre {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="firstName"
        name="firstName"
        placeholder="Primer nombre"
        defaultValue={
          (actionState.payload?.get("firstName") as string) || defaultValue
        }
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="firstName" />
    </>
  );
};
