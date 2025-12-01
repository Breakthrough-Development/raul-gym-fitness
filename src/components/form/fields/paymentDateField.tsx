import type { ActionState } from "@/types/action-state";
import { DynamicDateField } from "./dynamic-fields/DynamicDateField";

type PaymentDateFieldProps = {
  actionState: ActionState;
  defaultValue?: string;
};

export const PaymentDateField = ({
  actionState,
  defaultValue,
}: PaymentDateFieldProps) => {
  return (
    <DynamicDateField
      actionState={actionState}
      name="paymentDate"
      label="Fecha de pago"
      defaultValue={defaultValue}
      data-testid="payment-date"
    />
  );
};
