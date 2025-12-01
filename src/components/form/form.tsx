import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ActionState } from "@/types/action-state";
type FormProps<T = unknown> = {
  action: (payload: FormData) => void;
  actionState: ActionState<T>;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState<T>) => void;
  onError?: (actionState: ActionState) => void;
  className?: string;
};

const Form = <T,>({
  children,
  actionState,
  action,
  onSuccess,
  onError,
  className,
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
    <form action={action} className={cn("flex flex-col gap-y-2", className)}>
      {children}
    </form>
  );
};

export { Form };
