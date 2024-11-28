import { AddressType, RoomType, BathroomType, Gender } from "@prisma/client";

export const AddressTypeDescriptions: Record<AddressType, string> = {
  [AddressType.R]: "Residential",
  [AddressType.B]: "Business",
};

// Mapping for RoomType enum
export const RoomTypeDescriptions: Record<RoomType, string> = {
  [RoomType.I]: "Individual",
  [RoomType.S]: "Shared",
};

// Mapping for BathroomType enum
export const BathroomTypeDescriptions: Record<BathroomType, string> = {
  [BathroomType.E]: "Ensuite",
  [BathroomType.S]: "Shared",
};

// Mapping for Gender enum
export const GenderDescriptions: Record<Gender, string> = {
  [Gender.F]: "Female",
  [Gender.M]: "Male",
  [Gender.X]: "Other",
};

// Function to get the description for any enum type
const getEnumDescription = <T extends string>(enumValue: T, enumMap: Record<T, string>): string => {
  return enumMap[enumValue];
};

export const getGenderDescription = (value: Gender) => {
  return getEnumDescription(value, GenderDescriptions);
}

export const getRoomTypeDescription = (value: RoomType) => {
  return getEnumDescription(value, RoomTypeDescriptions);
}
export const getBathroomTypeDescription = (value: BathroomType) => {
  return getEnumDescription(value, BathroomTypeDescriptions);
}