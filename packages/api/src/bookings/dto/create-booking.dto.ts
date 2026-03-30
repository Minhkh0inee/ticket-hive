import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  eventId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUUID('all', { each: true })
  seatIds: string[];

  @IsString()
  attendeeName: string;

  @IsEmail()
  attendeeEmail: string;

  @IsString()
  attendeePhone: string;
}
