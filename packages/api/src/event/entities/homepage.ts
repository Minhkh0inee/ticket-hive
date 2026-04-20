import { Seat } from 'src/seats/entities/seats.entity';
import { Event } from './event.entity';

export type HomepageData = {
  featured: Event[];
  trending: Event[];
  newest: Event[];
  special: Event[];
};

export interface SeatWithLock extends Seat {
  isLocked: boolean;
  lockedBy: string | null;
}
