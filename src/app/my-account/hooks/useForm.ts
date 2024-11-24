// src/hooks/useForm.ts
import { useEffect, useState } from 'react';
import { extractValidationErrors } from '../../../utils/form';
import { FormData, FormErrors } from '../types';
import { useFetchUserData } from './useFetchUserData';

const useForm = (initialData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<'initial' | 'updated' | 'error'>('initial');

  const { fetchUserData } = useFetchUserData(setFormData, setIsLoading);
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value && (name === 'number' || name === 'cityId' || name === 'provinceId') ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormState('initial');

    try {
      const response = await fetch('/api/user/property-owner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setValidationErrors({});
        setFormState('updated');
      } else {
        const errors = extractValidationErrors<FormErrors, FormData>(responseText, formData, validationErrors);
        setFormState('error');
        setValidationErrors(errors);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update account.');
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, setFormData, validationErrors, setValidationErrors, formState, isLoading, handleChange, handleSubmit };
};

export default useForm;
