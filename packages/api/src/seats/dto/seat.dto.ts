import { IsString, IsUUID } from 'class-validator';

export class SeatEventDto {
  @IsString()
  @IsUUID()
  eventId: string;
}
