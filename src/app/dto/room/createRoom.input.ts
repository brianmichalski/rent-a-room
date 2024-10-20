import { BathroomType, Gender, RoomType } from '@prisma/client'; // Adjust import based on your project structure
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min
} from 'class-validator';
import { AddressInput } from '../address.input';

export class CreateRoomInput extends AddressInput {
  @IsEnum(RoomType)
  public roomType!: RoomType;

  @IsEnum(BathroomType)
  public bathroomType!: BathroomType;

  @IsEnum(Gender)
  public gender!: Gender;

  @IsString()
  @IsNotEmpty()
  public description!: string;

  @IsNumber()
  @Min(1)
  public rentPrice!: number;

  @IsInt()
  @Min(1)
  public size!: number;

  @IsInt()
  @Min(1)
  public numberOfRooms!: number;
}
