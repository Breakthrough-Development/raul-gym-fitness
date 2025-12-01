export type ActionState<T = unknown> = {
  status: "IDLE" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
  payload?: FormData;
  data?: T;
};
