import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Max(100)
  @IsInt()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
