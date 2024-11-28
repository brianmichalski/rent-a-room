import { BathroomType, Gender, RoomType } from "@prisma/client";

export interface RoomResult {
  id: number;
  roomType: RoomType;
  bathroomType: BathroomType;
  gender: Gender;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  isRented: boolean;
  address: string;
  other: string;
  postalCode: string;
  city: string
  pictures: string[];
  ownerName: string;
  ownerCity: string;
  ownerPhone: string;
  isFavorite?: boolean;
}

export interface CityResult {
  id: number;
  name: string
  province: string
}