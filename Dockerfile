FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app

COPY .env .env

RUN npm prune --production

ENV NODE_ENV production

CMD ["node", "dist/server.js"]
