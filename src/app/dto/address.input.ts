import {
  IsNotEmpty,
  IsOptional,
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
  @MaxLength(6)
  @Matches(/([a-z]\d){3}/i)
  public postalCode!: string;

  @IsNotEmpty()
  public cityId!: number;
}
