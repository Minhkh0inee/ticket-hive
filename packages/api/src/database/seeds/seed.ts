import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { Event, CategoryEnum } from '../../event/entities/event.entity';
import { Seat, SeatSection, SeatStatus } from '../../seats/entities/seats.entity';
import { Booking } from '../../bookings/entities/bookings.entity';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: join(__dirname, '../../../../../', envFile) });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, Event, Seat, Booking],
  synchronize: false,
});

const EVENTS = [
  { title: 'Sơn Tùng M-TP Live Concert 2026', venue: 'Sân vận động Mỹ Đình', city: 'Ha Noi', category: CategoryEnum.MUSIC, basePrice: 800000 },
  { title: 'Đêm nhạc Trịnh Công Sơn', venue: 'Nhà hát Hòa Bình', city: 'Ho Chi Minh City', category: CategoryEnum.MUSIC, basePrice: 500000 },
  { title: 'Vietnam Football Championship', venue: 'Sân vận động Thống Nhất', city: 'Ho Chi Minh City', category: CategoryEnum.SPORTS, basePrice: 300000 },
  { title: 'Da Nang International Fireworks Festival', venue: 'Cầu Rồng', city: 'Da Nang', category: CategoryEnum.FESTIVAL, basePrice: 200000 },
  { title: 'Tech Summit Vietnam 2026', venue: 'GEM Center', city: 'Ho Chi Minh City', category: CategoryEnum.CONFERENCE, basePrice: 1500000 },
  { title: 'Kịch Lưu Quang Vũ - Hồn Trương Ba', venue: 'Nhà hát Tuổi Trẻ', city: 'Ha Noi', category: CategoryEnum.THEATRE, basePrice: 400000 },
  { title: 'Rap Việt Live Show Season 4', venue: 'Nhà thi đấu Phú Thọ', city: 'Ho Chi Minh City', category: CategoryEnum.MUSIC, basePrice: 600000 },
  { title: 'Hội chợ ẩm thực Đà Nẵng 2026', venue: 'Trung tâm Hội chợ Triển lãm', city: 'Da Nang', category: CategoryEnum.FESTIVAL, basePrice: 100000 },
  { title: 'StartupVN Demo Day 2026', venue: 'Toà nhà Landmark 81', city: 'Ho Chi Minh City', category: CategoryEnum.CONFERENCE, basePrice: 2000000 },
  { title: 'Lễ hội ánh sáng Hà Nội', venue: 'Hồ Hoàn Kiếm', city: 'Ha Noi', category: CategoryEnum.FESTIVAL, basePrice: 150000 },
];

async function generateSeats(dataSource: DataSource, event: Event): Promise<void> {
  const seatRepo = dataSource.getRepository(Seat);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const seats: Partial<Seat>[] = [];

  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({
        row,
        number: num,
        label: `${row}${num}`,
        section: row === 'A' ? SeatSection.VIP : row <= 'C' ? SeatSection.FLOOR : SeatSection.GENERAL,
        status: SeatStatus.AVAILABLE,
        priceModifier: row === 'A' ? 1.5 : 1.0,
        event,
      });
    }
  }

  await seatRepo.save(seats);
}

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Connected to Neon');

  const userRepo = AppDataSource.getRepository(User);
  const eventRepo = AppDataSource.getRepository(Event);

  // ── Seed users ───────────────────────────────────────
  const existingAdmin = await userRepo.findOne({ where: { email: 'admin@tickethive.com' } });

  let admin: User;
  if (!existingAdmin) {
    admin = userRepo.create({
      firstName: 'Admin',
      lastName: 'TicketHive',
      email: 'admin@tickethive.com',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✅ Admin user created');
  } else {
    admin = existingAdmin;
    console.log('⏭️  Admin user already exists');
  }

  const existingUser = await userRepo.findOne({ where: { email: 'user@tickethive.com' } });
  if (!existingUser) {
    const testUser = userRepo.create({
      firstName: 'Nguyen',
      lastName: 'Van A',
      email: 'user@tickethive.com',
      passwordHash: await bcrypt.hash('User123!', 10),
      role: UserRole.USER,
    });
    await userRepo.save(testUser);
    console.log('✅ Test user created');
  } else {
    console.log('⏭️  Test user already exists');
  }

  // ── Seed events + seats ──────────────────────────────
  for (const eventData of EVENTS) {
    const existing = await eventRepo.findOne({ where: { title: eventData.title } });

    if (!existing) {
      const daysFromNow = 30 + Math.floor(Math.random() * 180);
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + daysFromNow);

      const event = eventRepo.create({
        ...eventData,
        description: `Sự kiện ${eventData.title} tại ${eventData.venue}, ${eventData.city}. Đừng bỏ lỡ!`,
        eventDate,
        totalSeats: 100,
        availableSeats: 100,
        organizer: admin,
      });

      const savedEvent = await eventRepo.save(event);
      await generateSeats(AppDataSource, savedEvent);
      console.log(`✅ Event created: ${eventData.title}`);
    } else {
      console.log(`⏭️  Event already exists: ${eventData.title}`);
    }
  }

  await AppDataSource.destroy();
  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});