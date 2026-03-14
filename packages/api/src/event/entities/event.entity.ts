
import { User } from '../../auth/entities/user.entity';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

export enum CategoryEnum {
    MUSIC = 'music',
    SPORTS = 'sports',
    THEATRE='theatre',
    FESTIVAL = 'festival',
    CONFERENCE ='conference'
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

  @Column({
    type: 'enum',
    enum: CategoryEnum
  })
  category: CategoryEnum

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

  @ManyToOne(() => User, (user) => user.events)
  organizer: User
}
