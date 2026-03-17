import {
    IsString, IsEnum, IsDate, IsNumber,
    IsOptional, IsUrl, Min, MaxLength,
    IsPositive
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CategoryEnum } from '../entities/event.entity';
  
  export class CreateEventDto {
    @IsString()
    @MaxLength(200)
    title: string;
  
    @IsString()
    description: string;
  
    @IsString()
    @MaxLength(200)
    venue: string;
  
    @IsString()
    @MaxLength(100)
    city: string;
  
    @IsEnum(CategoryEnum)
    category: CategoryEnum;
  
    @IsDate()
    @Type(() => Date)
    eventDate: Date;
  
    @IsOptional()
    @IsUrl()
    bannerUrl?: string | null;
  
    @IsNumber()
    @IsPositive()
    totalSeats: number;
  
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    basePrice: number;
  }