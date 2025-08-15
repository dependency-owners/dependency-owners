/**
 * Get a formatted error message.
 * @param error The error to format.
 * @returns The formatted error message.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
