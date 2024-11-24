import { AddressType } from "@prisma/client";

export interface FormData {
  firstName: string;
  lastName: string;
  phone?: string;
  street: string;
  number: number;
  other?: string;
  postalCode: string;
  cityId: number;
  provinceId: number;
  type: AddressType;
}

export interface FormErrors {
  phone?: string;
  street?: string;
  number?: number;
  other?: string;
  postalCode?: string;
  cityId?: number;
  provinceId?: number;
  type?: AddressType;
  general?: string;
}
