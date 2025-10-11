import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";
import { toast } from "sonner";
import { ActionState } from "./util/to-action-state";
type FormProps<T = unknown> = {
  action: (payload: FormData) => void;
  actionState: ActionState<T>;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState<T>) => void;
  onError?: (actionState: ActionState) => void;
};

const Form = <T,>({
  children,
  actionState,
  action,
  onSuccess,
  onError,
}: FormProps<T>) => {
  useActionFeedback(actionState, {
    onSuccess: () => {
      if (actionState.message) {
        toast.success(actionState.message);
      }
      onSuccess?.(actionState);
    },
    onError: () => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
      onError?.(actionState);
    },
  });
  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export { Form };
