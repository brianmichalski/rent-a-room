'use client'; // Ensure this component is client-side

import { BathroomType, Gender, RoomType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { extractValidationErrors } from '../../../utils/form';
import Breadcrumb from '../../components/breadcrumb';

// Address Input type for validation
interface AddressInput {
  street: string;
  number: number;
  other?: string;
  postalCode: string;
  cityId: number;
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

// Form data for the room details
interface CreateRoomFormData extends AddressInput {
  roomType: RoomType;
  bathroomType: BathroomType;
  gender: Gender;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  street: string;
  number: number;
  other?: string;
  postalCode: string;
  cityId: number;
  provinceId: number;
}

interface FormErrors {
  roomType?: string;
  bathroomType?: string;
  gender?: string;
  description?: string;
  rentPrice?: string;
  size?: string;
  numberOfRooms?: string;
  street?: string;
  number?: number;
  other?: string;
  postalCode?: string;
  cityId?: string;
  general?: string;
}

const CreateRoomPage = () => {
  const [formData, setFormData] = useState<CreateRoomFormData>({
    roomType: RoomType.I, // Default values
    bathroomType: BathroomType.S,
    gender: Gender.M,
    description: '',
    rentPrice: 0,
    size: 0,
    numberOfRooms: 1,
    street: '',
    number: 0,
    postalCode: '',
    cityId: 0,
    provinceId: 0,
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState<'initial' | 'updated' | 'error'>('initial');
  const [activeTab, setActiveTab] = useState<'room' | 'address'>('room');


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const provinceResponse = await fetch('/api/city/provinces');
        if (!provinceResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }
        const provinceData = await provinceResponse.json();
        setProvinces(provinceData);
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
      alert('Failed to update account.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-ads', label: 'My Ads' }, { href: '/my-ads/new', label: 'New' }]} />
      {/* Tabs Section */}

      <div className='block '>
        {formState === 'updated' ?
          <div className='text-center mt-8 p-2 bg-green-100 text-green-500 rounded-md'>
            Add saved successfully!
          </div>
          : ''}
        {formState === 'error' ?
          <div className='text-center mt-8 p-2 bg-red-100 text-red-500 rounded-md'>
            Verify the errors and try again
          </div>
          : ''}
      </div>
      <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
        {/* Tab Button for Room Details */}
        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'room' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Room Details
        </button>

        {/* Tab Button for Address */}
        <button
          onClick={() => setActiveTab('address')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'address' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Address
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Message */}
        {validationErrors.general && <p className="text-red-500 text-sm mb-4">{validationErrors.general}</p>}

        {/* Conditional Form Rendering Based on Active Tab */}
        {activeTab === 'room' && (
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3'>
            {/* Room Type */}
            <div>
              <label htmlFor="roomType" className="block text-gray-700">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={RoomType.I}>Individual</option>
                <option value={RoomType.S}>Shared</option>
              </select>
              {validationErrors.roomType && <p className="text-red-500 text-sm mt-1">{validationErrors.roomType}</p>}
            </div>

            {/* Bathroom Type */}
            <div>
              <label htmlFor="bathroomType" className="block text-gray-700">Bathroom Type</label>
              <select
                id="bathroomType"
                name="bathroomType"
                value={formData.bathroomType}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={BathroomType.S}>Shared</option>
                <option value={BathroomType.E}>Ensuite</option>
              </select>
              {validationErrors.bathroomType && <p className="text-red-500 text-sm mt-1">{validationErrors.bathroomType}</p>}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={Gender.M}>Male</option>
                <option value={Gender.F}>Female</option>
                <option value={Gender.X}>Other</option>
              </select>
              {validationErrors.gender && <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>}
            </div>

            {/* Rent Price */}
            <div>
              <label htmlFor="rentPrice" className="block text-gray-700">Rent Price</label>
              <input
                type="number"
                id="rentPrice"
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.rentPrice && <p className="text-red-500 text-sm mt-1">{validationErrors.rentPrice}</p>}
            </div>

            {/* Size */}
            <div>
              <label htmlFor="size" className="block text-gray-700">Size (m²)</label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.size && <p className="text-red-500 text-sm mt-1">{validationErrors.size}</p>}
            </div>

            {/* Number of Rooms */}
            <div>
              <label htmlFor="numberOfRooms" className="block text-gray-700">Number of Rooms</label>
              <input
                type="number"
                id="numberOfRooms"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.numberOfRooms && <p className="text-red-500 text-sm mt-1">{validationErrors.numberOfRooms}</p>}
            </div>

            {/* Description */}
            <div className='sm:col-span-3'>
              <label htmlFor="description" className="block text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3'>
            {/* Street */}
            <div>
              <label htmlFor="street" className="block text-gray-700">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                maxLength={100}
              />
              {validationErrors.street && <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>}
            </div>

            {/* Number */}
            <div>
              <label htmlFor="number" className="block text-gray-700">Number</label>
              <input
                type="number"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.number && <p className="text-red-500 text-sm mt-1">{validationErrors.number}</p>}
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.postalCode && <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>}
            </div>

            {/* Other (Optional) */}
            <div>
              <label htmlFor="other" className="block text-gray-700">Other</label>
              <input
                type="text"
                id="other"
                name="other"
                value={formData.other ?? ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.other && <p className="text-red-500 text-sm mt-1">{validationErrors.other}</p>}
            </div>

            {/* Province */}
            <div>
              <label className="block text-gray-700">Province:</label>
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

            {/* City */}
            <div>
              <label className="block text-gray-700">City:</label>
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

          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 mt-6 text-white font-semibold rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Creating Room...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;
