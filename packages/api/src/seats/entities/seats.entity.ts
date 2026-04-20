import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Event } from '../../event/entities/event.entity';

export enum SeatSection {
  FLOOR = 'floor',
  BALCONY = 'balcony',
  VIP = 'vip',
  GENERAL = 'general',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

@Entity()
export class Seat extends AbstractEntity {
  @Column({ type: 'varchar', length: 5 })
  row: string;

  @Column()
  number: number;

  @Column({ type: 'varchar', length: 10 })
  label: string;

  @Column({ type: 'enum', enum: SeatSection })
  section: SeatSection;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
  status: SeatStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  priceModifier: number;

  @Index()
  @ManyToOne(() => Event, (event) => event.seats)
  event: Event;
}
