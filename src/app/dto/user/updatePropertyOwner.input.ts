import { AddressType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { AddressInput } from '../address.input';

export class UpdatePropertyOwnerInput extends AddressInput {
  @IsNotEmpty()
  @IsEnum(AddressType)
  public type!: AddressType;

  @IsNotEmpty()
  @IsPhoneNumber('CA')
  public phone!: string;
}