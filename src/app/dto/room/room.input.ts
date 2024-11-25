import { BathroomType, Gender, RoomType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min
} from 'class-validator';
import { AddressInput } from '../address.input';

export class RoomInput extends AddressInput {
  @IsEnum(RoomType, { message: 'Select a valid option for Room Type' })
  public roomType!: RoomType;

  @IsEnum(BathroomType, { message: 'Select a valid option for Bathroom' })
  public bathroomType!: BathroomType;

  @IsEnum(Gender, { message: 'Select a valid option for Gender' })
  public gender!: Gender;

  @IsString()
  @IsNotEmpty()
  public description!: string;

  @IsNumber()
  @Min(100)
  public rentPrice!: number;

  @IsInt()
  @Min(10)
  @Max(51)
  public size!: number;

  @IsInt()
  @Min(1)
  public numberOfRooms!: number;

  // filled by the API with the user id from the session token
  public ownerId!: number;
}
