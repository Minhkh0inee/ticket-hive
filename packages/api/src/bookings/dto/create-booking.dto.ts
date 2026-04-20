import {
  IsString,
  IsEmail,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-of-event' })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    example: ['uuid-seat-1', 'uuid-seat-2'],
    minItems: 1,
    maxItems: 4,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUUID('all', { each: true })
  seatIds: string[];

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  attendeeName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  attendeeEmail: string;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  attendeePhone: string;
}
