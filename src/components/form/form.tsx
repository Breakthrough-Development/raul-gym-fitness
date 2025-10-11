import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";
import { CommentWithMetaData } from "@/features/comment/types";
import { toast } from "sonner";
import { ActionState } from "./util/to-action-state";
type FormProps = {
  action: (payload: FormData) => void;
  actionState: ActionState;
  children: React.ReactNode;
  onSuccess?: (
    actionState: ActionState
  ) => void;
  onError?: (actionState: ActionState) => void;
};

const Form = ({
  children,
  actionState,
  action,
  onSuccess,
  onError,
}: FormProps) => {
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
