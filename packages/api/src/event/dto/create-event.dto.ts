import {
    IsString, IsEnum, IsDate, IsNumber,
    IsOptional, IsUrl, Min, MaxLength,
    IsPositive, IsUUID
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { EventTag } from '../entities/event.entity';

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

    @IsOptional()
    @IsUUID()
    categoryId?: string;
  
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

    @IsOptional()
    @IsEnum(EventTag)
    tag?: EventTag;
  }