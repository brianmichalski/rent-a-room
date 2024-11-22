'use client';

import { useEffect, useState } from 'react';
import { AddressType } from '@prisma/client';

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
  const [isLoading, setIsLoading] = useState(true);

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

        console.log(provinceData)

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
      [name]: name === 'number' || name === 'cityId' || name === 'provinceId' ? parseInt(value) : value,
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/property-owner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      alert('Account updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update account.');
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Update Account</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
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
