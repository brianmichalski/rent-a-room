// src/hooks/useForm.ts
import { useState } from 'react';
import { extractValidationErrors } from '../../../../utils/form';

const useForm = (initialData: CreateRoomFormData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<'initial' | 'updated' | 'error'>('initial');
  const [formData, setFormData] = useState<CreateRoomFormData>(initialData);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'number' || name === 'cityId' || name === 'provinceId' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setFormState('initial');

      const response = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setValidationErrors({});
        setFormState('updated');
      } else {
        const errors = extractValidationErrors<FormErrors, CreateRoomFormData>(
          responseText,
          formData,
          validationErrors
        );
        setFormState('error');
        setValidationErrors(errors);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to save changes.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, formState, formData, setFormData, validationErrors, handleChange, handleSubmit };
};

export default useForm;
