#!/bin/bash

# assets/config 디렉토리 생성
mkdir -p /usr/src/app/src/assets/config

# 환경변수 기반으로 config.json 생성
cat > /usr/src/app/src/assets/config/config.json << EOF
{
  "apiUrl": "${API_URL:-http://localhost:3001}/api",
  "production": ${PRODUCTION:-false}
}
EOF

echo "🔧 Config generated:"
cat /usr/src/app/src/assets/config/config.json 