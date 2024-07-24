FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run routes
RUN npm run spec

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app

CMD ["npm", "run", "start:server"]
