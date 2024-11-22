'use client'; // Ensure this component is client-side

import { BathroomType, Gender, RoomType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Breadcrumb from '../../components/breadcrumb';

// Address Input type for validation
interface AddressInput {
  street: string;
  number: number;
  other?: string;
  postalCode: string;
  cityId: number;
}

// Form data for the room details
interface CreateRoomFormData extends AddressInput {
  roomType: RoomType;
  bathroomType: BathroomType;
  gender: Gender | null;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
}

interface FormErrors {
  roomType?: string;
  bathroomType?: string;
  gender?: string;
  description?: string;
  rentPrice?: string;
  size?: string;
  numberOfRooms?: string;
  address?: string;
  general?: string;
}

const CreateRoomPage = () => {
  const [formData, setFormData] = useState<CreateRoomFormData>({
    roomType: RoomType.I, // Default values
    bathroomType: BathroomType.S,
    gender: null,
    description: '',
    rentPrice: 0,
    size: 0,
    numberOfRooms: 1,
    street: '',
    number: 0,
    postalCode: '',
    cityId: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'room' | 'address'>('room'); // State for active tab
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Room validation
    if (!formData.description || formData.description.length < 10 || formData.description.length > 500) {
      newErrors.description = 'Description must be between 10 and 500 characters';
    }
    if (!formData.rentPrice || formData.rentPrice < 1) {
      newErrors.rentPrice = 'Rent price must be a positive number';
    }
    if (!formData.size || formData.size < 1) {
      newErrors.size = 'Size must be greater than 0';
    }
    if (!formData.numberOfRooms || formData.numberOfRooms < 1) {
      newErrors.numberOfRooms = 'Number of rooms must be greater than 0';
    }

    // Address validation
    if (!formData.street || formData.street.length > 100) {
      newErrors.address = 'Street name is required and should be less than 100 characters';
    }
    if (!formData.number || formData.number < 1) {
      newErrors.address = 'Street number is required';
    }
    if (!formData.postalCode || formData.postalCode.length !== 6) {
      newErrors.address = 'Postal code should be exactly 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.ok) {
        router.push('/rooms'); // Redirect after room creation
      } else {
        const errorData = JSON.parse(responseText);
        const { message, errors } = errorData;

        let serverErrors: FormErrors = { general: message };

        if (errors) {
          serverErrors = {
            ...serverErrors,
            ...errors,
          };
        }

        setErrors(serverErrors);
      }
    } catch (error) {
      console.error('Error during room creation:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-ads', label: 'My Ads' }, { href: '/my-ads/new', label: 'New' }]} />
      {/* Tabs Section */}
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
        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

        {/* Conditional Form Rendering Based on Active Tab */}
        {activeTab === 'room' && (
          <>
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
              {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
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
              {errors.bathroomType && <p className="text-red-500 text-sm mt-1">{errors.bathroomType}</p>}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender ?? ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={Gender.M}>Male</option>
                <option value={Gender.F}>Female</option>
                <option value={Gender.X}>Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                min={1}
              />
              {errors.rentPrice && <p className="text-red-500 text-sm mt-1">{errors.rentPrice}</p>}
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
                min={1}
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
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
                min={1}
              />
              {errors.numberOfRooms && <p className="text-red-500 text-sm mt-1">{errors.numberOfRooms}</p>}
            </div>
          </>
        )}

        {activeTab === 'address' && (
          <>
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
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                min={1}
              />
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
                maxLength={100}
              />
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
                maxLength={6}
              />
            </div>

            {/* City ID */}
            <div>
              <label htmlFor="cityId" className="block text-gray-700">City</label>
              <input
                type="number"
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-6 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Creating Room...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;
