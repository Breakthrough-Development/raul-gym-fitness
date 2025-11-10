import { AlertCircle } from "lucide-react";
import { ActionState } from "./util/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
  "data-testid"?: string;
};

const FieldError = ({ actionState, name, "data-testid": dataTestId }: FieldErrorProps) => {
  const message = actionState.fieldErrors[name]?.[0];
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 animate-in fade-in duration-200" data-testid={dataTestId}>
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
      <span className="text-sm text-destructive md:text-base leading-relaxed">
        {message}
      </span>
    </div>
  );
};

export { FieldError };
