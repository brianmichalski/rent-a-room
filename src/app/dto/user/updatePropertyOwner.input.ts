import { AddressType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, Matches, MaxLength } from 'class-validator';

export class UpdatePropertyOwnerInput {
  @IsNotEmpty()
  @IsEnum(AddressType)
  public type!: AddressType;

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

  @IsNotEmpty()
  @IsPhoneNumber('CA')
  public phone!: string;
}