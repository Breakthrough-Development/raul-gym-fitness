"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import type { ActionState } from "@/types/action-state";
import { useActionState, useEffect, useState } from "react";

type UseEditableFormProps = {
  action: (
    state: ActionState,
    formData: FormData
  ) => ActionState | Promise<ActionState>;
};

/**
 * Custom hook that manages editable form state with error recovery.
 *
 * This hook encapsulates:
 * - Form action state management
 * - Editing mode toggle
 * - Automatic re-enable editing on error
 * - Action handler that disables editing on submit
 */
export const useEditableForm = ({ action }: UseEditableFormProps) => {
  const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);
  const [isEditing, setIsEditing] = useState(false);

  // Re-enable editing when an error occurs
  useEffect(() => {
    if (actionState.status === "ERROR") {
      setIsEditing(true);
    }
  }, [actionState]);

  // Handle form submission - disable editing before submitting
  const handleAction = (formData: FormData) => {
    setIsEditing(false);
    formAction(formData);
  };

  const toggleEditing = () => setIsEditing((state) => !state);

  return {
    actionState,
    isEditing,
    setIsEditing,
    toggleEditing,
    handleAction,
  };
};
