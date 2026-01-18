import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('seed database');

  // Tạo admin user
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.nguoiDung.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      pass_word: hashedPassword,
      name: 'Admin',
      role: 'admin',
      phone: '0347848389',
    },
  });

  console.log('Đã tạo admin:', admin.email);

  // Tạo user 
  const user = await prisma.nguoiDung.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      pass_word: hashedPassword,
      name: 'User0001',
      role: 'user',
      phone: '0347848388',
    },
  });

  console.log('Đã tạo user:', user.email);
  // Tạo locations
  const location1 = await prisma.viTri.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ten_vi_tri: 'Hà Nội',
      tinh_thanh: 'Hà Nội',
      quoc_gia: 'Việt Nam',
      hinh_anh: null,
    },
  });

  const location2 = await prisma.viTri.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ten_vi_tri: 'TP.HCM',
      tinh_thanh: 'TP.HCM',
      quoc_gia: 'Việt Nam',
      hinh_anh: null,
    },
  });

  console.log('Đã tạo vị trí:', location1.ten_vi_tri, location2.ten_vi_tri);

  // Tạo rooms
  const room1 = await prisma.phong.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ten_phong: 'Phòng đẹp tại Hà Nội',
      khach: 4,
      phong_ngu: 2,
      giuong: 2,
      phong_tam: 1,
      mo_ta: 'Phòng rộng rãi, thoáng mát, đầy đủ tiện nghi',
      gia_tien: 500000,
      may_giat: true,
      ban_la: true,
      tivi: true,
      dieu_hoa: true,
      wifi: true,
      bep: true,
      do_xe: false,
      ho_boi: false,
      ban_ui: true,
      ma_vi_tri: location1.id,
    },
  });

  const room2 = await prisma.phong.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ten_phong: 'Căn hộ sang trọng tại TP.HCM',
      khach: 6,
      phong_ngu: 3,
      giuong: 3,
      phong_tam: 2,
      mo_ta: 'Căn hộ cao cấp, view đẹp, gần trung tâm',
      gia_tien: 1000000,
      may_giat: true,
      ban_la: true,
      tivi: true,
      dieu_hoa: true,
      wifi: true,
      bep: true,
      do_xe: true,
      ho_boi: true,
      ban_ui: true,
      ma_vi_tri: location2.id,
    },
  });

  console.log('Đã tạo phòng:', room1.ten_phong, room2.ten_phong);

}

main()
  .catch((e) => {
    console.error('Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
