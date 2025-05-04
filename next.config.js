/** @type {import('next').NextConfig} */

const fs = require('fs');
const path = require('path');

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    // runtime.env 파일이 있으면 읽어서 환경변수로 설정
    ...(fs.existsSync(path.join(process.cwd(), 'runtime.env'))
      ? Object.fromEntries(
          fs
            .readFileSync(path.join(process.cwd(), 'runtime.env'), 'utf-8')
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => line.split('='))
        )
      : {}),
  },
};

module.exports = nextConfig;
