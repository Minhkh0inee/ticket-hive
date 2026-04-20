import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @Transform(({ value }: TransformFnParams) => {
    return Array.isArray(value) ? (value as string[]) : [value as string];
  })
  ignoreIds?: string[];

  @IsOptional()
  @IsIn(['this_week', 'this_month'])
  dateFilter?: 'this_week' | 'this_month';
}
