Setup:
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
Run:
npm run start:dev
  Server: http://localhost:5000
  Swagger: http://localhost:5000/api
Auth:
Authorization: Bearer <token>
Env:
DATABASE_URL="mysql://user:pass@localhost:3306/db_airbnb"
JWT_SECRET="secret"
PORT=5000