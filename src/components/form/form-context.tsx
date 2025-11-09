"use client";
import { createContext, useContext } from "react";
import { useFormStatus } from "react-dom";

type FormContextValue = {
  isPending?: boolean;
};

// Internal implementation detail - used by Form component
export const FormContext = createContext<FormContextValue>({});

// Private/internal function - only used by useFormPending
const useFormContext = () => useContext(FormContext);

// Public hook that combines context and useFormStatus
export const useFormPending = () => {
  const { pending: formStatusPending } = useFormStatus();
  const { isPending: contextIsPending } = useFormContext();
  // Use context isPending if available (more reliable), otherwise fall back to useFormStatus
  return contextIsPending ?? formStatusPending;
};

