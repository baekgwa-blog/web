##########################################################
# 1) Builder
##########################################################
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
ARG NEXT_PUBLIC_API_SERVER_URL
ENV NEXT_PUBLIC_API_SERVER_URL=$NEXT_PUBLIC_API_SERVER_URL

RUN npm run build

##########################################################
# 2) Production
##########################################################
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/next.config.js ./

RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "run", "start"]
