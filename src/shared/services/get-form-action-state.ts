import type { Schema } from "zod";

const getErrorsMap = (
  payload: Record<string, FormDataEntryValue | string | number | boolean>,
  validateSchema: Schema,
): Map<string, string> => {
  const errorsMap = new Map();

  const validatedFields = validateSchema.safeParse(payload);

  if (!validatedFields.success) {
    const errors: Record<string, string | string[] | undefined> =
      validatedFields.error.flatten().fieldErrors;

    for (const key in errors) {
      const errorText = errors[key] && typeof errors[key][0] === "string" ? errors[key][0] : "";
      if (errorText) {
        errorsMap.set(key, errorText);
      }
    }
  }

  return errorsMap;
};

export const getValidatePayload = <T>(payload: T, validateSchema: Schema) => {
  //@ts-ignore
  const errorMap = getErrorsMap(payload, validateSchema);
  const isValid = errorMap.size === 0;

  const errors = {} as Record<keyof T, string>;

  for (const key in payload) {
    errors[key] = errorMap.has(key as string) ? String(errorMap.get(key as string)) : "";
  }

  return { isValid, errors };
};
