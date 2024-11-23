export function extractValidationErrors<FormErrors, FormData>(httpResponse: string,
  formData: FormData, validationErrors: FormErrors) {

  const { errors } = JSON.parse(httpResponse);
  for (const key in formData) {
    const fieldError = errors.find((er: string) => er.startsWith(key));
    if (fieldError) {
      validationErrors[key as unknown as keyof FormErrors] = fieldError.replace(key, camelCaseToSpaces(key));
    }
  }
  return validationErrors;
}

function camelCaseToSpaces(input: string) {
  // Add spaces between camelCase words
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize the first letter
  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}