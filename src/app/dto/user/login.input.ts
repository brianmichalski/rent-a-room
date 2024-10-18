import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @IsNotEmpty()
  public password!: string;
}