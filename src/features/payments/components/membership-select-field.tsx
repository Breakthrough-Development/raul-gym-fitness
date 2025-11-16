"use client";
import { FieldError } from "@/components/form/field-error";
import { ActionState } from "@/components/form/util/to-action-state";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembershipStatus, Payment } from "@prisma/client";
import { getMembershipLabel } from "../utility/getMembershipLabel";

export type MembershipSelectFieldProps = {
  actionState: ActionState;
  payment?: Pick<Payment, "membership">;
};

export const MembershipSelectField = ({
  actionState,
  payment,
}: MembershipSelectFieldProps) => {
  const membershipStatus = Object.values(MembershipStatus);

  const membershipDefaultValue = () => {
    if (actionState.payload?.get("membership") as string) {
      return actionState.payload?.get("membership") as string;
    }
    if (payment?.membership) {
      return payment.membership;
    }
    return MembershipStatus.MONTHLY;
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor="membership" className="text-base md:text-lg">
        Membresía
      </Label>
      <Select name="membership" defaultValue={membershipDefaultValue()}>
        <SelectTrigger className="text-base md:text-lg">
          <SelectValue placeholder="Selecciona una membresía" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Membresía</SelectLabel>
            {membershipStatus.map((status) => (
              <SelectItem key={status} value={status}>
                {getMembershipLabel(status)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError actionState={actionState} name="membership" />
    </div>
  );
};
