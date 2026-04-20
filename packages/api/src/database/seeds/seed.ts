import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { Event } from '../../event/entities/event.entity';
import {
  Seat,
  SeatSection,
  SeatStatus,
} from '../../seats/entities/seats.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { Category } from '../../categories/entities/category.entity';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: join(__dirname, '../../../../../', envFile) });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, Event, Seat, Booking, Category],
  synchronize: false,
});

const EVENTS: {
  title: string;
  venue: string;
  city: string;
  categorySlug: string;
  basePrice: number;
}[] = [
  // ── AM NHAC ──────────────────────────────────────────
  {
    title: 'Sơn Tùng M-TP Live Concert 2026',
    venue: 'Sân vận động Mỹ Đình',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 800000,
  },
  {
    title: 'Đêm nhạc Trịnh Công Sơn',
    venue: 'Nhà hát Hòa Bình',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 500000,
  },
  {
    title: 'Rap Việt Live Show Season 4',
    venue: 'Nhà thi đấu Phú Thọ',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 600000,
  },
  {
    title: 'Hà Anh Tuấn - Postcards Tour 2026',
    venue: 'Trung tâm Hội nghị Quốc gia',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 900000,
  },
  {
    title: 'Mỹ Tâm World Tour - Vietnam Night',
    venue: 'Sân vận động Thống Nhất',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 750000,
  },
  {
    title: 'Đen Vâu & Friends Live 2026',
    venue: 'Nhà hát Lớn Hà Nội',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 650000,
  },
  {
    title: 'Vietnam Electronic Music Festival',
    venue: 'Bãi biển Mỹ Khê',
    city: 'Da Nang',
    categorySlug: 'am-nhac',
    basePrice: 450000,
  },
  {
    title: 'Indie Night - Cà phê âm nhạc',
    venue: 'Nhà hát Tuổi Trẻ',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 200000,
  },
  {
    title: 'Jazz Under The Stars',
    venue: 'Công viên 23/9',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 350000,
  },
  {
    title: 'Rock Saigon 2026',
    venue: 'Đầm Sen Outdoor',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 400000,
  },
  {
    title: 'Bích Phương - Kẻ Đào Tẩu Concert',
    venue: 'Cung thể thao Tiên Sơn',
    city: 'Da Nang',
    categorySlug: 'am-nhac',
    basePrice: 550000,
  },
  {
    title: 'Hoàng Dũng - Một Lần Cuối Tour',
    venue: 'Nhà hát TP.HCM',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 700000,
  },
  {
    title: 'Classical Night - Vietnam Philharmonic',
    venue: 'Nhà hát Lớn Hà Nội',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 800000,
  },
  {
    title: 'K-Pop Cover Night Saigon',
    venue: 'GEM Center',
    city: 'Ho Chi Minh City',
    categorySlug: 'am-nhac',
    basePrice: 300000,
  },
  {
    title: 'Tùng Dương - Nghệ Sĩ & Đêm',
    venue: 'Nhà hát Chèo Việt Nam',
    city: 'Ha Noi',
    categorySlug: 'am-nhac',
    basePrice: 600000,
  },

  // ── THE THAO ─────────────────────────────────────────
  {
    title: 'Vietnam Football Championship',
    venue: 'Sân vận động Thống Nhất',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 300000,
  },
  {
    title: 'AFF Cup 2026 - Việt Nam vs Thái Lan',
    venue: 'Sân vận động Mỹ Đình',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 500000,
  },
  {
    title: 'VBA Finals 2026 - Saigon Heat vs Hanoi Buffaloes',
    venue: 'Nhà thi đấu Phú Thọ',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 250000,
  },
  {
    title: 'Vietnam Open Tennis 2026',
    venue: 'Trung tâm Tennis Hà Nội',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 200000,
  },
  {
    title: 'Marathon Đà Nẵng 2026',
    venue: 'Bãi biển Mỹ Khê',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 350000,
  },
  {
    title: 'Boxing Night Vietnam 2026',
    venue: 'Cung thể thao Tiên Sơn',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 400000,
  },
  {
    title: 'Vietnam Esports Championship - LOL Finals',
    venue: 'Trung tâm Hội nghị Quốc gia',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 150000,
  },
  {
    title: 'Giải Cầu Lông Toàn Quốc 2026',
    venue: 'Nhà thi đấu Gia Lâm',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 100000,
  },
  {
    title: 'Ironman 70.3 Vietnam 2026',
    venue: 'Khu resort Vinpearl',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 800000,
  },
  {
    title: 'Vietnam Swimming Championship',
    venue: 'Bể bơi Mỹ Đình',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 120000,
  },
  {
    title: 'SEA Games 2026 - Bóng rổ 3x3',
    venue: 'Nhà thi đấu Cầu Giấy',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 180000,
  },
  {
    title: 'V.League Round 20 - HCMC FC vs Hà Nội FC',
    venue: 'Sân vận động Thống Nhất',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 150000,
  },
  {
    title: 'Vietnam MMA Championship 2026',
    venue: 'Cung thể thao Tiên Sơn',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 350000,
  },
  {
    title: 'Giải Bóng Chuyền Quốc Gia 2026',
    venue: 'Nhà thi đấu Thanh Trì',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 100000,
  },
  {
    title: 'Vietnam International Golf Open',
    venue: 'Sân golf BRG Legend Hill',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 500000,
  },
  {
    title: 'Cycling Tour Vietnam 2026 - Chặng Đà Nẵng',
    venue: 'Quảng trường 29/3',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 80000,
  },
  {
    title: 'Taekwondo Vietnam Open 2026',
    venue: 'Nhà thi đấu Phú Thọ',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 90000,
  },
  {
    title: 'Vietnam Surfing Championship 2026',
    venue: 'Bãi biển Mỹ Khê',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 120000,
  },
  {
    title: 'Premier Padel Vietnam Tour 2026',
    venue: 'Khu thể thao GS Metrocity',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 250000,
  },
  {
    title: 'Vietnam Esports - PUBG Mobile Finals',
    venue: 'GEM Center',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 200000,
  },
  {
    title: 'Giải Bóng Bàn Toàn Quốc 2026',
    venue: 'Nhà thi đấu Hoàng Mai',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 80000,
  },
  {
    title: 'Vietnam Judo Championship 2026',
    venue: 'Nhà thi đấu Gia Lâm',
    city: 'Ha Noi',
    categorySlug: 'the-thao',
    basePrice: 70000,
  },
  {
    title: 'CrossFit Vietnam Open 2026',
    venue: 'Khu thể thao Landmark 81',
    city: 'Ho Chi Minh City',
    categorySlug: 'the-thao',
    basePrice: 300000,
  },
  {
    title: 'Vietnam Wheelchair Basketball League Finals',
    venue: 'Cung thể thao Tiên Sơn',
    city: 'Da Nang',
    categorySlug: 'the-thao',
    basePrice: 60000,
  },

  // ── KICH ─────────────────────────────────────────────
  {
    title: 'Kịch Lưu Quang Vũ - Hồn Trương Ba',
    venue: 'Nhà hát Tuổi Trẻ',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 400000,
  },
  {
    title: 'Vở kịch - Dạ Cổ Hoài Lang',
    venue: 'Nhà hát Kịch TP.HCM',
    city: 'Ho Chi Minh City',
    categorySlug: 'kich',
    basePrice: 350000,
  },
  {
    title: 'Múa Rối Nước Truyền Thống',
    venue: 'Nhà hát Múa Rối Thăng Long',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 200000,
  },
  {
    title: 'Ballet - Hồ Thiên Nga',
    venue: 'Nhà hát Lớn Hà Nội',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 600000,
  },
  {
    title: 'Cải Lương - Tiếng Trống Mê Linh',
    venue: 'Nhà hát Trần Hữu Trang',
    city: 'Ho Chi Minh City',
    categorySlug: 'kich',
    basePrice: 250000,
  },
  {
    title: 'Stand-up Comedy Night Hà Nội',
    venue: 'Nhà hát Đài Tiếng Nói Việt Nam',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 300000,
  },
  {
    title: 'Musical - Mamma Mia Vietnam',
    venue: 'Nhà hát Hòa Bình',
    city: 'Ho Chi Minh City',
    categorySlug: 'kich',
    basePrice: 700000,
  },
  {
    title: 'Opera Đêm Hà Nội',
    venue: 'Nhà hát Lớn Hà Nội',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 500000,
  },
  {
    title: 'Xiếc Việt Nam - Đặc sắc 2026',
    venue: 'Rạp Xiếc Trung Ương',
    city: 'Ha Noi',
    categorySlug: 'kich',
    basePrice: 180000,
  },
  {
    title: 'Kịch nói - Ngày Xưa Có Một Chuyện Tình',
    city: 'Ho Chi Minh City',
    venue: 'Sân khấu kịch IDECAF',
    categorySlug: 'kich',
    basePrice: 220000,
  },

  // ── LE HOI ───────────────────────────────────────────
  {
    title: 'Da Nang International Fireworks Festival',
    venue: 'Cầu Rồng',
    city: 'Da Nang',
    categorySlug: 'le-hoi',
    basePrice: 200000,
  },
  {
    title: 'Hội chợ ẩm thực Đà Nẵng 2026',
    venue: 'Trung tâm Hội chợ Triển lãm',
    city: 'Da Nang',
    categorySlug: 'le-hoi',
    basePrice: 100000,
  },
  {
    title: 'Lễ hội ánh sáng Hà Nội',
    venue: 'Hồ Hoàn Kiếm',
    city: 'Ha Noi',
    categorySlug: 'le-hoi',
    basePrice: 150000,
  },
  {
    title: 'Lễ hội bia Sài Gòn 2026',
    venue: 'Công viên Gia Định',
    city: 'Ho Chi Minh City',
    categorySlug: 'le-hoi',
    basePrice: 100000,
  },
  {
    title: 'Vietnam Street Food Festival 2026',
    venue: 'Phố đi bộ Nguyễn Huệ',
    city: 'Ho Chi Minh City',
    categorySlug: 'le-hoi',
    basePrice: 50000,
  },
  {
    title: 'Lễ hội Hoa Đà Lạt - Đêm Sài Gòn',
    venue: 'Nhà văn hóa Thanh Niên',
    city: 'Ho Chi Minh City',
    categorySlug: 'le-hoi',
    basePrice: 120000,
  },
  {
    title: 'Tết Trung Thu Phố Cổ 2026',
    venue: 'Phố cổ Hàng Mã',
    city: 'Ha Noi',
    categorySlug: 'le-hoi',
    basePrice: 80000,
  },
  {
    title: 'Vietnam Coffee Festival 2026',
    venue: 'Công viên 29/3',
    city: 'Da Nang',
    categorySlug: 'le-hoi',
    basePrice: 100000,
  },
  {
    title: 'Lễ hội áo dài Hội An',
    venue: 'Phố cổ Hội An',
    city: 'Da Nang',
    categorySlug: 'le-hoi',
    basePrice: 150000,
  },
  {
    title: 'Night Market Festival Saigon',
    venue: 'Khu đô thị Phú Mỹ Hưng',
    city: 'Ho Chi Minh City',
    categorySlug: 'le-hoi',
    basePrice: 60000,
  },

  // ── HOI NGHI ─────────────────────────────────────────
  {
    title: 'Tech Summit Vietnam 2026',
    venue: 'GEM Center',
    city: 'Ho Chi Minh City',
    categorySlug: 'hoi-nghi',
    basePrice: 1500000,
  },
  {
    title: 'StartupVN Demo Day 2026',
    venue: 'Toà nhà Landmark 81',
    city: 'Ho Chi Minh City',
    categorySlug: 'hoi-nghi',
    basePrice: 2000000,
  },
  {
    title: 'Vietnam AI & Data Summit',
    venue: 'Trung tâm Hội nghị Quốc gia',
    city: 'Ha Noi',
    categorySlug: 'hoi-nghi',
    basePrice: 1800000,
  },
  {
    title: 'Google DevFest Hanoi 2026',
    venue: 'Tòa nhà FPT Cầu Giấy',
    city: 'Ha Noi',
    categorySlug: 'hoi-nghi',
    basePrice: 500000,
  },
  {
    title: 'Vietnam Blockchain Summit 2026',
    venue: 'Sofitel Metropole',
    city: 'Ha Noi',
    categorySlug: 'hoi-nghi',
    basePrice: 2500000,
  },
  {
    title: 'UX Vietnam Conference 2026',
    venue: 'Toà nhà WeWork Saigon',
    city: 'Ho Chi Minh City',
    categorySlug: 'hoi-nghi',
    basePrice: 800000,
  },
  {
    title: 'Digital Marketing Vietnam Summit',
    venue: 'White Palace Convention Center',
    city: 'Ho Chi Minh City',
    categorySlug: 'hoi-nghi',
    basePrice: 1200000,
  },
  {
    title: 'Vietnam Fintech Forum 2026',
    venue: 'InterContinental Danang',
    city: 'Da Nang',
    categorySlug: 'hoi-nghi',
    basePrice: 3000000,
  },
  {
    title: 'Women in Tech Vietnam 2026',
    venue: 'Impact Hub Saigon',
    city: 'Ho Chi Minh City',
    categorySlug: 'hoi-nghi',
    basePrice: 400000,
  },
  {
    title: 'Cloud & DevOps Vietnam Meetup',
    venue: 'Toà nhà FPT Đà Nẵng',
    city: 'Da Nang',
    categorySlug: 'hoi-nghi',
    basePrice: 300000,
  },
];

async function generateSeats(
  dataSource: DataSource,
  event: Event,
): Promise<void> {
  const seatRepo = dataSource.getRepository(Seat);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const seats: Partial<Seat>[] = [];

  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({
        row,
        number: num,
        label: `${row}${num}`,
        section:
          row === 'A'
            ? SeatSection.VIP
            : row <= 'C'
              ? SeatSection.FLOOR
              : SeatSection.GENERAL,
        status: SeatStatus.AVAILABLE,
        priceModifier: row === 'A' ? 1.5 : row <= 'C' ? 1.2 : 1.0,
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
  const categoryRepo = AppDataSource.getRepository(Category);

  // ── Seed categories ───────────────────────────────────
  const CATEGORIES = [
    { name: 'Am Nhac', slug: 'am-nhac' },
    { name: 'The Thao', slug: 'the-thao' },
    { name: 'Kich', slug: 'kich' },
    { name: 'Le hoi', slug: 'le-hoi' },
    { name: 'Hoi Nghi', slug: 'hoi-nghi' },
  ];

  for (const cat of CATEGORIES) {
    const existing = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!existing) {
      await categoryRepo.save(categoryRepo.create(cat));
      console.log(`✅ Category created: ${cat.name}`);
    } else {
      console.log(`⏭️  Category already exists: ${cat.name}`);
    }
  }

  // ── Seed users ───────────────────────────────────────
  const existingAdmin = await userRepo.findOne({
    where: { email: 'admin@tickethive.com' },
  });

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

  const existingUser = await userRepo.findOne({
    where: { email: 'user@tickethive.com' },
  });
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

  // ── Load category map ────────────────────────────────
  const allCategories = await categoryRepo.find();
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c]));

  // ── Seed events + seats ──────────────────────────────
  let created = 0;
  let skipped = 0;

  for (const eventData of EVENTS) {
    const { categorySlug, ...rest } = eventData;
    const category = categoryMap.get(categorySlug) ?? null;
    const existing = await eventRepo.findOne({
      where: { title: eventData.title },
      relations: ['category'],
    });

    if (!existing) {
      const daysFromNow = 30 + Math.floor(Math.random() * 180);
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + daysFromNow);

      const event = eventRepo.create({
        ...rest,
        description: `Sự kiện ${eventData.title} tại ${eventData.venue}, ${eventData.city}. Đừng bỏ lỡ cơ hội trải nghiệm đặc sắc này!`,
        eventDate,
        totalSeats: 100,
        availableSeats: 100,
        organizer: admin,
        category,
      });

      const savedEvent = await eventRepo.save(event);
      await generateSeats(AppDataSource, savedEvent);
      console.log(`✅ [${categorySlug}] ${eventData.title}`);
      created++;
    } else {
      if (!existing.category && category) {
        await eventRepo.update(existing.id, { category } as Partial<Event>);
        console.log(
          `🔄 [${categorySlug}] Category assigned: ${eventData.title}`,
        );
      } else {
        console.log(`⏭️  Already exists: ${eventData.title}`);
      }
      skipped++;
    }
  }

  await AppDataSource.destroy();
  console.log(
    `\n🎉 Seed complete! Created: ${created} | Skipped: ${skipped} | Total: ${EVENTS.length} events`,
  );
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
