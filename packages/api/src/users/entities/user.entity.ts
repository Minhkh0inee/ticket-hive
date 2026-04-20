import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends AbstractEntity {
  @Column({
    length: 100,
  })
  firstName: string;

  @Column({
    length: 100,
  })
  lastName: string;

  @Index()
  @Column({ unique: true, length: 100 })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
