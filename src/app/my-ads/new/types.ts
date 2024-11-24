interface CreateRoomFormData {
  roomType: string;
  bathroomType: string;
  gender: string;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  street: string;
  number: number;
  other: string;
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