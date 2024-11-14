
export default function checkMissingFields(validationErrorFields: string[], errors: string[]) {
  const missingFields: string[] = [];
  validationErrorFields.forEach((key: string) => {
    if (!errors.some((error: string) => error.includes(key))) {
      missingFields.push(key);
    }
  });
  if (missingFields.length > 0) {
    throw new Error(`Expected field(s) '${missingFields.join(', ')}' to be validated.`);
  }
}