import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  public lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(15)
  public phoneNumber?: string;

  @IsString()
  @IsOptional()
  public avatar?: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  public firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  public lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(15)
  public phoneNumber?: string;

  @IsString()
  @IsOptional()
  public avatar?: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  public token: string;
}

export class ReqWithRefreshToken {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  public email: string;
}
