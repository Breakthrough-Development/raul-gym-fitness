import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useActionFeedback } from "./form/hooks/use-action-feedback";
import { ActionState, EMPTY_ACTION_STATE } from "./form/util/to-action-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type ConfirmDialogArgs = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState>;
  trigger: React.ReactElement | ((isLoading: boolean) => React.ReactElement);
  onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you undestand the consequences.",
  action,
  trigger,
  onSuccess,
}: ConfirmDialogArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE
  );

  const toastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      toastRef.current = toast.loading("Deleting...");
    } else if (toastRef.current) {
      toast.dismiss(toastRef.current);
    }
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isPending]);

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
    },
  });

  const dialogTrigger = cloneElement(
    typeof trigger === "function" ? trigger(isPending) : trigger,
    {
      onClick: () => setIsOpen((state) => !state),
      className: "cursor-pointer",
    } as React.HTMLAttributes<HTMLElement>
  );

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <form action={formAction}>
              <Button type="submit">Confirm</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export { useConfirmDialog };
