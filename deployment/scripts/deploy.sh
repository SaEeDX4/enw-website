#!/usr/bin/env bash
set -euo pipefail

MODE=${1:-atlas}
COMPOSE_FILE="docker-compose.atlas.yml"
ENV_FILE=".env.production"

echo "🚀 Starting ENW deployment ($MODE)..."

# 0) Docker engine check
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker Engine is not running. Start Docker Desktop and retry."
  exit 1
fi

# 1) Env file check
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Missing $ENV_FILE next to $COMPOSE_FILE"
  exit 1
fi

# 2) Optional: pre-pull base images
echo "📥 Pulling base images..."
docker pull node:18-alpine || true
docker pull nginx:alpine   || true

# 3) Stop existing containers
echo "🛑 Stopping old containers..."
docker compose -f "$COMPOSE_FILE" down

# 4) Build new images
echo "🐳 Building images..."
docker compose -f "$COMPOSE_FILE" build --no-cache

# 5) Start containers
echo "✨ Starting services..."
docker compose -f "$COMPOSE_FILE" up -d

# 6) Wait a bit
echo "⏳ Waiting for services..."
sleep 15

# 7) Health check
echo "🏥 Checking health..."
if curl -fsS http://localhost:3000/health; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
  docker compose -f "$COMPOSE_FILE" logs server
  exit 1
fi

if curl -fsS http://localhost; then
  echo "✅ Frontend is accessible"
else
  echo "⚠️ Frontend may not be ready yet"
fi

echo "🎉 Deployment complete!"
echo "   🌐 Frontend: http://localhost"
echo "   🔗 Backend API: http://localhost:3000/api"
