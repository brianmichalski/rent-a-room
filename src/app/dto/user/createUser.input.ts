import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @MaxLength(100)
  public firstName!: string;

  @IsNotEmpty()
  @MaxLength(100)
  public lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  public email!: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
  @IsNotEmpty()
  @MinLength(8)
  public password!: string;
}