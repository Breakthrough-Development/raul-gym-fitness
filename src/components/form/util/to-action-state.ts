import { ZodError, flattenError } from "zod";

export type ActionState = {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

export const formErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof ZodError) {
    return {
      message: "",
      fieldErrors: flattenError(error).fieldErrors,
      payload: formData,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      fieldErrors: {},
      payload: formData,
    };
  } else {
    return {
      message: "An unknown error occurred",
      fieldErrors: {},
      payload: formData,
    };
  }
};
