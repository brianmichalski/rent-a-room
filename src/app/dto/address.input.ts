import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  Min
} from 'class-validator';

export class AddressInput {
  @IsNotEmpty()
  @MaxLength(100)
  public street!: string;

  @IsInt()
  @Min(1)
  public number!: number;

  @IsOptional()
  @MaxLength(100)
  public other?: string;

  @IsNotEmpty()
  @Matches(/([a-z]\d){3}/i, { message: 'postalCode is not valid' })
  @Length(6, 6, { message: 'postalCode must have exactly 6 characters' })
  public postalCode!: string;

  @IsInt()
  @Min(1)
  public cityId!: number;
}
