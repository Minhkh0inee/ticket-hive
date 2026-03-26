import type { EventDetail } from '@/types/event.types'

export const mockEventDetails: Record<string, EventDetail> = {
  '1': {
    eventId: '1',
    endDate: '2026-04-17T22:00:00Z',
    venueAddress: '264 Trần Hưng Đạo, Đại Kim, Hoàng Mai, Hà Nội',
    galleryImages: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    ],
    fullDescription: `Coldplay mang đến Việt Nam hành trình âm nhạc vũ trụ đầy màu sắc với "Music of the Spheres World Tour" — một trong những tour diễn lớn nhất và được mong đợi nhất trên thế giới.

Buổi concert hứa hẹn là một trải nghiệm thị giác và âm thanh không thể quên: hàng nghìn vòng tay LED đồng bộ, hiệu ứng ánh sáng laser, màn hình khổng lồ và sân khấu xoay 360 độ. Chris Martin cùng các thành viên sẽ trình diễn các bản nhạc từ album mới nhất cùng những hit kinh điển như Yellow, The Scientist, Fix You, Viva La Vida.

Đây là lần đầu tiên Coldplay biểu diễn tại Việt Nam sau nhiều năm khán giả mong chờ. Đừng bỏ lỡ cơ hội vàng này để trở thành một phần của sự kiện âm nhạc lịch sử!

Lưu ý: Vé đã mua không hoàn lại. Cổng vào mở trước 2 giờ so với giờ diễn. Khán giả cần mang theo vé điện tử hoặc vé giấy cùng với CMND/CCCD để vào cổng.`,
    ticketTypes: [
      { id: 't1', name: 'Diamond VIP', price: '3500000', description: 'Ghế hàng đầu, quà tặng đặc biệt', available: true },
      { id: 't2', name: 'Gold', price: '2500000', description: 'Khu vực khán đài A', available: true },
      { id: 't3', name: 'Silver', price: '1500000', description: 'Khu vực khán đài B', available: false },
    ],
    organizer: {
      name: 'Live Nation Vietnam',
      logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80',
      description: 'Live Nation Vietnam là đơn vị tổ chức sự kiện âm nhạc hàng đầu tại Việt Nam, với hơn 15 năm kinh nghiệm tổ chức các buổi hòa nhạc quốc tế đình đám.',
    },
  },

  '2': {
    eventId: '2',
    endDate: '2026-05-21T23:00:00Z',
    venueAddress: '1 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh',
    galleryImages: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    fullDescription: `BLACKPINK trở lại với tour diễn "BORN PINK" đầy bùng nổ và mãn nhãn. Đây là lần đầu tiên nhóm nhạc nữ quyền lực nhất K-Pop tổ chức concert tại Việt Nam.

Jennie, Jisoo, Rosé và Lisa sẽ cùng nhau mang đến một đêm nhạc đỉnh cao với hàng loạt ca khúc hit như Shut Down, Pink Venom, How You Like That, Kill This Love và nhiều bản nhạc bùng nổ khác.

Sân khấu hoành tráng với dàn LED khổng lồ, hiệu ứng ánh sáng cực mạnh và vũ đạo cực kỳ chuyên nghiệp sẽ khiến bạn không thể rời mắt trong suốt đêm diễn.

BLINK Việt Nam, đây là khoảnh khắc chúng ta đã chờ đợi!`,
    ticketTypes: [
      { id: 't1', name: 'VIP BLINK Zone', price: '4500000', description: 'Gần sân khấu nhất, quà tặng fan kit', available: true },
      { id: 't2', name: 'Premium', price: '2500000', description: 'Khán đài có mái che, view tốt', available: true },
      { id: 't3', name: 'Standard', price: '2000000', description: 'Ghế thường khu A, B', available: false },
    ],
    organizer: {
      name: 'YG Entertainment x WME Vietnam',
      logoUrl: null,
      description: 'Phối hợp tổ chức bởi YG Entertainment và WME Vietnam — đơn vị đại diện âm nhạc hàng đầu tại Đông Nam Á.',
    },
  },

  '3': {
    eventId: '3',
    endDate: '2026-04-28T21:00:00Z',
    venueAddress: '264 Trần Hưng Đạo, Đại Kim, Hoàng Mai, Hà Nội',
    galleryImages: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    ],
    fullDescription: `Trận đấu bóng đá đỉnh cao giữa Đội tuyển Quốc gia Việt Nam và Thái Lan trong khuôn khổ AFF Championship 2026. Đây là trận chiến được chờ đợi nhất của bóng đá Đông Nam Á năm nay.

Sau chức vô địch lịch sử, Đội tuyển Việt Nam sẽ bảo vệ ngôi vương trên sân nhà Mỹ Đình với sự hỗ trợ của hàng vạn cổ động viên. Hãy cùng nhau tạo nên cơn địa chấn trắng ngần trên khán đài!

Vé bao gồm: Vào cổng xem trận, không bao gồm đồ ăn thức uống tại sân. Cổng vào mở 2 tiếng trước giờ đá. Mang theo CMND/CCCD khi đến sân.`,
    ticketTypes: [
      { id: 't1', name: 'Khán đài A (VIP)', price: '800000', available: true },
      { id: 't2', name: 'Khán đài B', price: '400000', available: true },
      { id: 't3', name: 'Khán đài C', price: '300000', available: false },
    ],
    organizer: {
      name: 'Liên đoàn Bóng đá Việt Nam (VFF)',
      logoUrl: null,
      description: 'Liên đoàn Bóng đá Việt Nam là tổ chức cao nhất quản lý bóng đá tại Việt Nam, thành viên của FIFA và AFC.',
    },
  },

  '4': {
    eventId: '4',
    endDate: '2026-04-12T22:00:00Z',
    venueAddress: '1 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    galleryImages: [
      'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80',
      'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    ],
    fullDescription: `Romeo và Juliet — vở kịch kinh điển bất tử của Shakespeare được dàn dựng lại bởi Nhà hát Kịch Quốc gia Việt Nam với diễn xuất đẳng cấp quốc tế.

Lấy cảm hứng từ tình yêu bất diệt vượt qua ranh giới, vở kịch được tái hiện với phục trang lộng lẫy, ánh đèn sân khấu đỉnh cao và dàn nhạc giao hưởng sống động. Các diễn viên được đào tạo tại các trường nghệ thuật danh tiếng trong và ngoài nước.

Đây là một tác phẩm sân khấu không thể bỏ lỡ cho những ai yêu nghệ thuật và văn học cổ điển.`,
    ticketTypes: [
      { id: 't1', name: 'Hàng ghế VIP (1-5)', price: '900000', available: true },
      { id: 't2', name: 'Hàng ghế đặc biệt (6-15)', price: '700000', available: true },
      { id: 't3', name: 'Hàng ghế thường (16+)', price: '500000', available: true },
    ],
    organizer: {
      name: 'Nhà hát Kịch Quốc gia Việt Nam',
      logoUrl: null,
      description: 'Nhà hát Kịch Quốc gia Việt Nam là đơn vị nghệ thuật sân khấu hàng đầu, với bề dày lịch sử hơn 70 năm xây dựng và phát triển nền kịch nghệ nước nhà.',
    },
  },

  '5': {
    eventId: '5',
    endDate: '2026-06-16T23:00:00Z',
    venueAddress: 'Công viên Thống Nhất, 381 Trần Nhân Tông, Hai Bà Trưng, Hà Nội',
    galleryImages: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    ],
    fullDescription: `Lễ Hội Âm Nhạc Gió Mùa (Monsoon Music Festival) — sự kiện âm nhạc ngoài trời lớn nhất Việt Nam, quy tụ hàng trăm nghệ sĩ trong và ngoài nước.

Trong 2 ngày diễn ra lễ hội, khán giả sẽ được thưởng thức âm nhạc từ jazz, indie, rock đến EDM trên 5 sân khấu khác nhau. Hàng chục gian hàng ẩm thực, nghệ thuật và văn hóa sẽ tạo nên không khí lễ hội sôi động và đầy màu sắc.

Đặc biệt năm nay có sự tham gia của các nghệ sĩ quốc tế từ Nhật Bản, Hàn Quốc, Pháp và Anh.`,
    ticketTypes: [
      { id: 't1', name: 'VIP Pass (2 ngày)', price: '1500000', description: 'Khu vực VIP, không giới hạn thức ăn đồ uống', available: true },
      { id: 't2', name: 'Vé ngày 1', price: '700000', available: true },
      { id: 't3', name: 'Vé ngày 2', price: '700000', available: true },
      { id: 't4', name: 'Combo 2 ngày', price: '1200000', available: false },
    ],
    organizer: {
      name: 'Hanoi Spirit of Place',
      logoUrl: null,
      description: 'Hanoi Spirit of Place là đơn vị tổ chức sự kiện văn hóa nghệ thuật có tiếng tại Hà Nội, sáng lập và tổ chức Monsoon Music Festival từ năm 2014.',
    },
  },

  '8': {
    eventId: '8',
    endDate: '2026-04-07T20:00:00Z',
    venueAddress: 'Mạch Đua Phố Hà Nội, Mỹ Đình, Nam Từ Liêm, Hà Nội',
    galleryImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1541773367105-b3e9c45f8b5c?w=800&q=80',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&q=80',
    ],
    fullDescription: `Formula 1 Vietnam Grand Prix trở lại sau nhiều năm vắng bóng — cuộc đua xe Công thức 1 hấp dẫn nhất trong lịch sử thể thao Việt Nam.

Đường đua hành trình qua trái tim thủ đô Hà Nội với 23 vòng đua mãn nhãn, tốc độ lên tới 335 km/h. Các tay đua đỉnh cao từ Red Bull, Ferrari, Mercedes đều có mặt tranh tài.

Ngoài cuộc đua chính, còn có các hoạt động bên lề: khu triển lãm siêu xe, trải nghiệm phòng chờ VIP, concert âm nhạc và nhiều hoạt động giải trí hấp dẫn suốt 3 ngày diễn ra sự kiện.`,
    ticketTypes: [
      { id: 't1', name: 'VIP Paddock Club (3 ngày)', price: '15000000', description: 'Khu vực pit lane, gặp gỡ đội đua', available: true },
      { id: 't2', name: 'Grandstand A (3 ngày)', price: '5000000', available: true },
      { id: 't3', name: 'General Admission (1 ngày)', price: '800000', available: false },
    ],
    organizer: {
      name: 'Formula One Management x Vietnam Motor Festival',
      logoUrl: null,
      description: 'Phối hợp tổ chức bởi Formula One Management (FOM) và Ủy ban Nhân dân Thành phố Hà Nội thông qua đơn vị Vietnam Motor Festival.',
    },
  },
}

// Generates fallback detail data for events not in the map above
export function getEventDetail(eventId: string): EventDetail {
  if (mockEventDetails[eventId]) return mockEventDetails[eventId]

  // Generic gallery images by event id (cycling through sets)
  const gallerySets = [
    [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80',
      'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    ],
  ]

  const idx = parseInt(eventId, 10) % gallerySets.length

  return {
    eventId,
    fullDescription: `Đây là sự kiện đặc biệt mà bạn không thể bỏ lỡ. Hãy cùng chúng tôi tạo nên những kỷ niệm đáng nhớ trong một không gian hoành tráng và chuyên nghiệp.

Sự kiện hứa hẹn mang lại trải nghiệm tuyệt vời với dàn nghệ sĩ tài năng, sân khấu được đầu tư công phu và không khí sôi động từ hàng nghìn khán giả.

Vé đã mua không được hoàn lại. Cổng vào mở 1 giờ trước giờ bắt đầu. Vui lòng mang theo vé và giấy tờ tùy thân khi vào cổng.`,
    galleryImages: gallerySets[idx],
    ticketTypes: [
      { id: 't1', name: 'Vé VIP', price: String(Math.round(parseInt('500000') * 2)), available: true },
      { id: 't2', name: 'Vé Thường', price: '500000', available: true },
    ],
    organizer: {
      name: 'TicketHive Events',
      logoUrl: null,
      description: 'TicketHive Events là đơn vị tổ chức sự kiện uy tín hàng đầu Việt Nam với nhiều năm kinh nghiệm trong việc mang đến những trải nghiệm giải trí đỉnh cao.',
    },
  }
}
