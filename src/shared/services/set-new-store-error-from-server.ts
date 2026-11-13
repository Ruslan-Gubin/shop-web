import type { ErrorItem } from "../types/response";

export const setErrorFromServer = <T>(
  errors: ErrorItem[],
  updateErrors: Record<keyof T, string>,
) => {
  for (const error of errors) {
    const key = error.key as keyof T;
    if (Object.hasOwn(updateErrors, key)) {
      updateErrors[key] = error.message;
    }
  }
};
