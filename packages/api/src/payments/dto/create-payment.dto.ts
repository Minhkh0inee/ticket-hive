import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderCode: number;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  buyerName: string;

  @IsString()
  buyerEmail: string;

  @IsString()
  buyerPhone: string;

  @IsOptional()
  @IsArray()
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];

  @IsOptional()
  @IsString()
  returnUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;
}