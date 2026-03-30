import { Seat } from '../../seats/entities/seats.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';

export enum EventTag {
    TRENDING = 'trending',
    SPECIAL = 'special',
    FEATURED = 'featured',
    NEW = 'new',
}

@Entity()
export class Event extends AbstractEntity {
  @Column({
    length: 200
  })
  title: string;

  @Column()
  description: string;

  @Column({
    length: 200
  })
  venue: string;

  @Column({
    length: 100
  })
  city: string;

  @ManyToOne(() => Category, { eager: true, nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null

  @Index()
  @Column({ type: 'timestamptz' })
  eventDate: Date;

  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string | null;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Index()
  @Column({ type: 'enum', enum: EventTag, nullable: true })
  tag: EventTag | null;

  @ManyToOne(() => User, (user) => user.events)
  organizer: User

  @OneToMany(() => Seat, (seat) => seat.event)
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];    
}
