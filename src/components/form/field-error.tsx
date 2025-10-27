import { ActionState } from "./util/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  const message = actionState.fieldErrors[name]?.[0];
  if (!message) return null;
  return (
    <span className="text-sm text-red text-red-500 md:text-base">
      {message}
    </span>
  );
};

export { FieldError };
