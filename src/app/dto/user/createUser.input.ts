import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  public firstName!: string;

  @IsNotEmpty()
  public lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
  @IsNotEmpty()
  public password!: string;
}