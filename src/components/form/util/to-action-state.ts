import { ZodError, flattenError } from "zod";

export type ActionState<T = unknown> = {
  status: "IDLE" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
  payload?: FormData;
  data?: T;
};

export const EMPTY_ACTION_STATE: ActionState<undefined> = {
  status: "IDLE",
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

export const fromErrorToActionState = <T = unknown>(
  error: unknown,
  formData?: FormData
): ActionState<T> => {
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: "",
      fieldErrors: flattenError(error).fieldErrors,
      payload: formData,
      timestamp: Date.now(),
    };
  } else if (error instanceof Error) {
    return {
      status: "ERROR",
      message: error.message,
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  } else {
    return {
      status: "ERROR",
      message: "Ocurrió un error desconocido",
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  }
};

export const toActionState = <T = unknown>(
  status: ActionState["status"],
  message: string,
  formData?: FormData,
  data?: T
): ActionState<T> => {
  return {
    status,
    message,
    fieldErrors: {},
    payload: formData,
    timestamp: Date.now(),
    data,
  };
};
