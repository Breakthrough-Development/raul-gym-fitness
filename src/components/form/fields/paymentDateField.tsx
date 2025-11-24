import { ActionState } from "@/components/form/util/to-action-state";
import { DynamicDateField } from "./dynamic-fields/DynamicDateField";

export type PaymentDateFieldProps = {
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
