import { AddressType } from "@prisma/client";
import { FormData } from "../types";

export const useFetchUserData = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/property-owner');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();

      // Set form data with user data
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        street: data.address?.street || '',
        number: data.address?.number || 0,
        other: data.address?.other || '',
        postalCode: data.address?.postalCode || '',
        cityId: data.address?.cityId || 0,
        provinceId: data.address?.city?.provinceId || 0,
        type: data.address?.type || AddressType.R,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUserData };
};
