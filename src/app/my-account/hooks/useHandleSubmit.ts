import { FormData, FormErrors } from './../types';

export const useHandleSubmit = async (
  e: React.FormEvent,
  formData: FormData,
  setFormState: React.Dispatch<React.SetStateAction<'initial' | 'updated' | 'error'>>,
  setValidationErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  setIsLoading(true);
  setFormState('initial');

  try {
    const response = await fetch('/api/user/property-owner', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setValidationErrors({});
      setFormState('updated');
    } else {
      const errors = await response.json();
      setValidationErrors(errors);
      setFormState('error');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    setIsLoading(false);
  }
};
