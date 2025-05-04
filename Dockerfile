##########################################################
# 1단계: 빌드용 스테이지 (Builder)
##########################################################

FROM node:22-slim AS builder

WORKDIR /app

# 의존성 정의 파일만 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (peer deps 충돌 무시)
RUN npm install --legacy-peer-deps

# 전체 소스 복사
COPY . .

# Next.js 빌드
RUN npm run build

##########################################################
# 2단계: 실제 서비스용 스테이지 (Production)
##########################################################

FROM node:22-slim

WORKDIR /app

# 프로덕션 환경변수 설정
ENV NODE_ENV=production

# 빌드된 결과물 + 필수 파일만 복사
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --only=production --legacy-peer-deps

# 환경변수 설정을 위한 스크립트 추가
RUN echo "#!/bin/sh" > /docker-entrypoint.sh && \
    echo "echo \"NOTION_TOKEN=\${NOTION_TOKEN}\" > /app/runtime.env" >> /docker-entrypoint.sh && \
    echo "echo \"NOTION_DATABASE_ID=\${NOTION_DATABASE_ID}\" >> /app/runtime.env" >> /docker-entrypoint.sh && \
    echo "exec \"\$@\"" >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# 컨테이너 3000 포트 개방
EXPOSE 3000

# 환경변수 설정 후 서버 시작
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
