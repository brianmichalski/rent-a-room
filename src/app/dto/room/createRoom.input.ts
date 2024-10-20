import { BathroomType, Gender, RoomType } from '@prisma/client'; // Adjust import based on your project structure
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min
} from 'class-validator';

export class CreateRoomInput {
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

  // Address fields
  @IsNotEmpty()
  @MaxLength(100)
  public street!: string;

  @IsNotEmpty()
  public number!: number;

  @IsOptional()
  @MaxLength(100)
  public other?: string;

  @IsNotEmpty()
  @MaxLength(6)
  @Matches(/([a-z]\d){3}/i)
  public postalCode!: string;

  @IsNotEmpty()
  public cityId!: number;
}
