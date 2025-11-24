import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { upsertPayment } from "@/features/payments/actions/upsert-payment";
import { useQueryClient } from "@tanstack/react-query";
import { useActionState } from "react";

type UsePaymentFormProps = {
  paymentId?: string;
  onSuccess?: (actionState: unknown) => void;
};

export const usePaymentForm = ({
  paymentId,
  onSuccess,
}: UsePaymentFormProps) => {
  const queryClient = useQueryClient();
  const [actionState, formAction] = useActionState(
    upsertPayment.bind(null, paymentId),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (state: unknown) => {
    queryClient.invalidateQueries({ queryKey: ["metric"] });
    onSuccess?.(state);
  };

  return {
    actionState,
    formAction,
    handleSuccess,
  };
};

