FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies 
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

EXPOSE 5000

# Run migrations and start server
CMD sh -c "npx prisma migrate deploy && npm run start:prod"
