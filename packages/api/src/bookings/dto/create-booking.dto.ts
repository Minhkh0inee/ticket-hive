import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  eventId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  seatIds: string[];

  @IsString()
  attendeeName: string;

  @IsEmail()
  attendeeEmail: string;

  @IsString()
  attendeePhone: string;
}
