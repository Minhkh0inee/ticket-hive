import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { Booking } from '../bookings/entities/bookings.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Payment extends AbstractEntity {
  @Column({ type: 'bigint', unique: true })
  orderCode: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  paymentLinkId: string | null;

  @Column({ type: 'varchar', nullable: true })
  checkoutUrl: string | null;

  @OneToOne(() => Booking, (booking) => booking.payment, { nullable: false })
  @JoinColumn()
  booking: Booking;
}
