import {
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength
} from 'class-validator';

export class AddressInput {
  @IsNotEmpty()
  @MaxLength(100)
  public street!: string;

  @IsNotEmpty()
  public number!: number;

  @IsOptional()
  @MaxLength(100)
  public other?: string;

  @IsNotEmpty()
  @Matches(/([a-z]\d){3}/i, { message: 'postalCode is not valid' })
  @Length(6, 6, { message: 'postalCode must have exactly 6 characteres' })
  public postalCode!: string;

  @IsNotEmpty()
  public cityId!: number;
}
