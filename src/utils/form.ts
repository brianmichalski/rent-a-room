export function extractValidationErrors<FormErrors, FormData>(
  httpResponse: string,
  formData: FormData,
  validationErrors: FormErrors
): FormErrors {
  const { errors } = JSON.parse(httpResponse);

  // Create a new object to hold validation errors
  const newValidationErrors: FormErrors = {} as FormErrors;

  for (const key in formData) {
    const fieldError = errors.find((er: string) => er.startsWith(key));
    if (fieldError) {
      newValidationErrors[key as unknown as keyof FormErrors] = fieldError.replace(key, camelCaseToSpaces(key));
    }
  }

  return newValidationErrors;
}

function camelCaseToSpaces(input: string) {
  // Add spaces between camelCase words
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize the first letter
  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}
