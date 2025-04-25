import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginatedDataDto {
  @IsNumberString()
  @IsOptional()
  public page?: number;

  @IsNumberString()
  @IsOptional()
  public limit?: number;

  @IsString()
  @IsOptional()
  public search?: string;

  @IsString()
  @IsOptional()
  public status?: string;

  @IsString()
  @IsOptional()
  public type?: string;

  @IsString()
  @IsOptional()
  public exchange?: string;

  @IsString()
  @IsOptional()
  public class?: string;
}
