export const getMessageError = (error: Error | string, defaultMessage: string) =>
  Error.isError(error)
    ? error.message
    : typeof error === "string" && error.length > 0
      ? error
      : defaultMessage;
