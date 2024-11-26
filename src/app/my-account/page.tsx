'use client';

import { AddressType } from '@prisma/client';
import CitySelect from '../components/input/city-select/city-select';
import ProvinceSelect from '../components/input/city-select/province-select';
import useForm from './hooks/useForm';
import { FormData } from './types';

const UpdateAccountForm = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    number: 0,
    other: '',
    postalCode: '',
    cityId: 0,
    provinceId: 0,
    type: AddressType.R,
  } as FormData;

  // --- Hook calls ---
  const {
    formData,
    validationErrors,
    formState,
    isLoading,
    handleChange,
    handleSubmit,
  } = useForm(initialFormData);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Update Account</h2>
      {formState === 'saved' ? (
        <div className='text-center mt-8 p-2 bg-green-100 text-green-500 rounded-md'>
          Account updated successfully!
        </div>
      ) : ''}
      {formState === 'error' ? (
        <div className='text-center mt-8 p-2 bg-red-100 text-red-500 rounded-md'>
          Verify the errors and try again
        </div>
      ) : ''}

      {/* Form Fields */}
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
