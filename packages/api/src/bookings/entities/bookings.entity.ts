import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../event/entities/event.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Booking extends AbstractEntity {
  @Column({ type: 'jsonb' })
  seatIds: string[];

  @Column({ type: 'varchar' })
  attendeeName: string;

  @Column({ type: 'varchar' })
  attendeeEmail: string;

  @Column({ type: 'varchar' })
  attendeePhone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event: Event;
}