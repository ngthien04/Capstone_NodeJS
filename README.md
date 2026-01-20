# Airbnb Backend API

## Cài đặt và Chạy 

### Cách 1: Chạy bằng Docker 

```bash
docker-compose up -d
```

Sau khi chạy xong, truy cập:
- **API Server**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/api
- **MySQL**: localhost:3308 (root/1234, database: db_airbnb)

### Cách 2: Chạy local 

**1: Dùng MySQL từ Docker**
```bash
# 1. Chỉ chạy MySQL từ docker-compose
docker-compose up -d mysql

# 2. Setup và chạy backend local
npm install
# 3. tạo file .env với nội dung:
DATABASE_URL="mysql://root:1234@localhost:3308/db_airbnb"
JWT_SECRET="your-secret-key"
PORT=5000

npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

**2: Dùng MySQL đã cài trên máy**

```bash
# 1. Đảm bảo MySQL đang chạy trên máy
# 2. Tạo database
mysql -u root -p
CREATE DATABASE db_airbnb;

# 3. Tạo file .env
DATABASE_URL="mysql://root:your_password@localhost:3306/db_airbnb"
JWT_SECRET="your-secret-key"
PORT=5000

# 4. Setup và chạy backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

## Authentication

API sử dụng JWT Bearer Token:
1. Đăng ký/Đăng nhập tại `/auth/signup` hoặc `/auth/signin` để lấy `access_token`
2. Trong Swagger UI, click nút **"Authorize"** và nhập: `Bearer YOUR_ACCESS_TOKEN`

## API Endpoints

Xem đầy đủ API documentation tại: http://localhost:5000/api

- **Auth**: `/auth/signin`, `/auth/signup`
- **Users**: `/users` (CRUD)
- **Locations**: `/location` (CRUD)
- **Rooms**: `/room` (CRUD)
- **Bookings**: `/booking` (CRUD)
- **Comments**: `/comment` (CRUD)
