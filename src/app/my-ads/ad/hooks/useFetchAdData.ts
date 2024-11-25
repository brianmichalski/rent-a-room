import { Gender, RoomType } from "@prisma/client";
import { RoomFormData } from "../types";

export const useFetchAdData = (
  id: number,
  setFormData: React.Dispatch<React.SetStateAction<RoomFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fetchAdData = async () => {
    try {
      let data = undefined;
      if (id) {
        const response = await fetch(`/api/room/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        data = await response.json();
      }
      // Set form data with user data
      setFormData({
        roomType: data.roomType || RoomType.I,
        bathroomType: data.bathroomType || '',
        gender: data.gender || Gender.X,
        description: data.description || '',
        rentPrice: data.rentPrice || 0,
        size: data.size || 0,
        numberOfRooms: data.numberOfRooms || 0,
        street: data.address?.street || '',
        number: data.address?.number || 0,
        other: data.address?.other || '',
        postalCode: data.address?.postalCode || '',
        cityId: data.address?.cityId || 0,
        provinceId: data.address?.city?.provinceId || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchAdData };
};
