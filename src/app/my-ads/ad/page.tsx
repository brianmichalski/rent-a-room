'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { BathroomType, Gender, RoomType } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Breadcrumb from '../../components/layout/breadcrumb';
import CitySelect from '../../components/input/city-select/city-select';
import ProvinceSelect from '../../components/input/city-select/province-select';
import useForm from './hooks/useForm';
import { RoomFormData } from './types';

// Initial Form Data
const initialFormData = {
  roomType: RoomType.I,
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
  other: ''
} as RoomFormData;

const CreateRoomPage = () => {
  const searchParams = useSearchParams(); // Retrieve query parameters
  const id = searchParams?.get('id'); // Get adId from query
  const isEditMode: boolean = !!id;

  // --- Hook calls ---
  const {
    isLoading,
    formState,
    formData,
    validationErrors,
    handleChange,
    handleSubmit,
  } = useForm(Number(id), initialFormData);

  const [activeTab, setActiveTab] = useState<'room' | 'address'>('room');

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-ads', label: 'My Ads' }, { href: '/my-ads/ad', label: 'New' }]} />
      <div className='flex gap-x-2 items-center mb-6'>
        <Link href={'/my-ads/'} title='Go back' className='p-2 hover:bg-gray-100'>
          <ChevronLeftIcon className='text-blue-600' width={24} />
        </Link>
        <h1 className="text-3xl font-semibold">{isEditMode ? 'Edit Ad' : 'New Ad'}</h1>
        {isEditMode ? <span className='text-gray-500'>#{id}</span> : ''}
      </div>
      <div className='block '>
        {formState === 'saved' ?
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
        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'room' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Room Details
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'address' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Address
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Message */}
        {validationErrors.general && <p className="text-red-500 text-sm mb-4">{validationErrors.general}</p>}

        {activeTab === 'room' && (
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3'>
            {/* Room Type */}
            <div>
              <label className="block text-gray-700">Room Type:</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value={RoomType.I}>Individual</option>
                <option value={RoomType.S}>Shared</option>
              </select>
              {validationErrors.roomType && <p className="text-red-500 text-sm mt-1">{validationErrors.roomType}</p>}
            </div>

            {/* Bathroom Type */}
            <div>
              <label className="block text-gray-700">Bathroom Type:</label>
              <select
                name="bathroomType"
                value={formData.bathroomType}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value={BathroomType.S}>Shared</option>
                <option value={BathroomType.E}>Ensuite</option>
              </select>
              {validationErrors.bathroomType && <p className="text-red-500 text-sm mt-1">{validationErrors.bathroomType}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value={Gender.M}>Male</option>
                <option value={Gender.F}>Female</option>
                <option value={Gender.X}>Any</option>
              </select>
              {validationErrors.gender && <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>}
            </div>

            {/* Rent Price */}
            <div>
              <label className="block text-gray-700">Rent Price:</label>
              <input
                type="number"
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Enter Rent Price"
              />
              {validationErrors.rentPrice && <p className="text-red-500 text-sm mt-1">{validationErrors.rentPrice}</p>}
            </div>

            {/* Size */}
            <div>
              <label className="block text-gray-700">Size:</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Enter Size"
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
              <label className="block text-gray-700">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Enter Description"
              />
              {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ProvinceSelect
              value={formData.provinceId}
              onChange={handleChange}
            />

            <CitySelect
              provinceId={formData.provinceId}
              value={formData.cityId}
              onChange={handleChange}
              disabled={!formData.provinceId}
              error={validationErrors.cityId != null}
            />

            {/* Street */}
            <div>
              <label className="block text-gray-700">Street:</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Enter Street"
              />
              {validationErrors.street && <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>}
            </div>

            {/* Number */}
            <div>
              <label className="block text-gray-700">Street Number:</label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Street Number"
              />
              {validationErrors.number && <p className="text-red-500 text-sm mt-1">{validationErrors.number}</p>}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-gray-700">Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Postal Code"
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
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md mt-6 w-full"
        >
          {isLoading ? 'Saving...' : 'Save Ad'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;
