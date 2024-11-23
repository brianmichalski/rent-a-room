'use client';

import { AddressType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { extractValidationErrors } from '../../utils/form';

interface FormData {
  firstName: string;
  lastName: string;
  phone?: string;
  street: string;
  number: number;
  other?: string;
  postalCode: string;
  cityId: number;
  provinceId: number;
  type: AddressType;
}
interface FormErrors {
  phone?: string;
  street?: string;
  number?: number;
  other?: string;
  postalCode?: string;
  cityId?: number;
  provinceId?: number;
  type?: AddressType;
  general?: string;
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const UpdateAccountForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    number: 0,
    other: '',
    postalCode: '',
    cityId: 0,
    provinceId: 0,
    type: AddressType.R, // Default AddressType
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState<'initial' | 'updated' | 'error'>('initial');

  // Fetch user data and provinces on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userResponse, provinceResponse] = await Promise.all([
          fetch('/api/user/property-owner'),
          fetch('/api/city/provinces'),
        ]);

        if (!userResponse.ok || !provinceResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }

        const userData = await userResponse.json();
        const provinceData = await provinceResponse.json();

        setProvinces(provinceData);

        // Flatten user data
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          street: userData.address?.street || '',
          number: userData.address?.number || 0,
          other: userData.address?.other || '',
          postalCode: userData.address?.postalCode || '',
          cityId: userData.address?.cityId || 0,
          provinceId: userData.address?.city?.provinceId || 0,
          type: userData.address?.type || AddressType.R,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch cities when provinceId changes
  useEffect(() => {
    if (formData.provinceId) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`/api/city/${formData.provinceId}`);
          if (!response.ok) throw new Error('Failed to fetch cities');
          const cityData = await response.json();
          setCities(cityData);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };

      fetchCities();
    }
  }, [formData.provinceId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value && (name === 'number' || name === 'cityId' || name === 'provinceId') ? parseInt(value) : value,
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormState('initial');
    try {
      const response = await fetch('/api/user/property-owner', {
        method: 'PUT',
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
        const errors = extractValidationErrors<FormErrors, FormData>(
          responseText,
          formData,
          validationErrors
        );
        setFormState('error');
        setValidationErrors(errors); // Update validation errors in state
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update account.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Update Account</h2>
      {formState === 'updated' ?
        <div className='text-center mt-8 p-2 bg-green-100 text-green-500 rounded-md'>
          Account updated successfully!
        </div>
        : ''}
      {formState === 'error' ?
        <div className='text-center mt-8 p-2 bg-red-100 text-red-500 rounded-md'>
          Verify the errors and try again
        </div>
        : ''}
      <div>
        <label className="block text-sm font-medium text-gray-600">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          disabled={true}
          className="w-full mt-1 p-2 rounded-md bg-gray-100 border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          disabled={true}
          className="w-full mt-1 p-2 border rounded-md bg-gray-100 border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
        {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Street:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
        {validationErrors.street && <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Number:</label>
        <input
          type="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
        {validationErrors.number && <p className="text-red-500 text-sm mt-1">{validationErrors.number}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Other:</label>
        <input
          type="text"
          name="other"
          value={formData.other}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
        {validationErrors.other && <p className="text-red-500 text-sm mt-1">{validationErrors.other}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
        {validationErrors.postalCode && <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Province:</label>
        <select
          name="provinceId"
          value={formData.provinceId}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select a province</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">City:</label>
        <select
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          disabled={!formData.provinceId}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {validationErrors.cityId && <p className="text-red-500 text-sm mt-1">Required field</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Address Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value={AddressType.R}>Residential</option>
          <option value={AddressType.B}>Business</option>
        </select>
        {validationErrors.type && <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Update Account
      </button>
    </form>
  );
};

export default UpdateAccountForm;
