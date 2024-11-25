import { useEffect, useState } from 'react';
import { extractValidationErrors } from '../../../../utils/form';
import { FormErrors, RoomFormData } from '../types';
import { useFetchAdData } from './useFetchAdData';

const useForm = (id: number, initialData: RoomFormData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<'initial' | 'saved' | 'error'>('initial');
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<RoomFormData>(initialData);

  const { fetchAdData } = useFetchAdData(id, setFormData, setIsLoading);

  useEffect(() => {
    if (id && formData.cityId === 0) {
      fetchAdData();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert values to integers for specific fields
    setFormData({
      ...formData,
      [name]: ['number', 'cityId', 'provinceId'].includes(name)
        ? parseInt(value) || 0 // Fall back to 0 if parsing fails
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setFormState('initial');

      const endpoint = id ? `/api/room/${id}` : '/api/room';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setValidationErrors({});
        setFormState('saved');
      } else {
        // Assuming the response contains validation errors in a format we can process
        const errors = extractValidationErrors<FormErrors, RoomFormData>(
          responseText,
          formData
        );
        setFormState('error');
        setValidationErrors(errors);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      setValidationErrors({ general: 'Failed to save changes. Check the console.' });
      setFormState('error');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, formState, formData, setFormData, validationErrors, handleChange, handleSubmit };
};

export default useForm;
