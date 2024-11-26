import { BathroomType, Gender, RoomType } from '@prisma/client';
import { AddressInput } from '../address.input';

export class RoomSearch {
  public cityId?: number;
  public roomType?: RoomType;
  public bathroomType?: BathroomType;
  public gender?: Gender;
  public description?: string;
  public rentPriceMin?: number;
  public rentPriceMax?: number;
  public sizeMin?: number;
  public sizeMax?: number;
  public numberOfRoomsMin?: number;
  public numberOfRoomsMax?: number;
  public sortBy?: 'price' | 'size';
  public sortDir?: 'asc' | 'desc';
}
