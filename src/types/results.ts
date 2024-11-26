export interface RoomResult {
  id: number;
  roomType: string;
  bathroomType: string;
  gender: string;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  isRented: boolean;
  street: string;
  number: number;
  other: string;
  postalCode: string;
  city: string
  pictures: string[];
}

export interface CityResult {
  id: number;
  name: string
  province: string
}