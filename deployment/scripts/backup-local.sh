#!/bin/bash

# Backup script for LOCAL MongoDB container
# NOTE: For MongoDB Atlas, use Atlas backup tools instead

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="enw_backup_${TIMESTAMP}"

# Check if using local MongoDB
if [ -z "${MONGO_USERNAME}" ] || [ -z "${MONGO_PASSWORD}" ]; then
    echo "⚠️ This script is for local MongoDB container only."
    echo "For MongoDB Atlas, use Atlas backup features:"
    echo "https://www.mongodb.com/docs/atlas/backup/"
    exit 1
fi

echo "🔒 Starting backup of local MongoDB..."

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Check if MongoDB container is running
if ! docker-compose ps | grep -q mongodb; then
    echo "❌ MongoDB container is not running"
    exit 1
fi

# Dump MongoDB data
echo "📦 Creating database dump..."
docker-compose exec -T mongodb mongodump \
    --authenticationDatabase admin \
    --username ${MONGO_USERNAME} \
    --password ${MONGO_PASSWORD} \
    --db enw \
    --out /tmp/${BACKUP_NAME}

# Compress backup
echo "🗜️ Compressing backup..."
docker-compose exec -T mongodb tar -czf /tmp/${BACKUP_NAME}.tar.gz -C /tmp ${BACKUP_NAME}

# Copy backup to host
echo "💾 Copying backup to host..."
docker cp $(docker-compose ps -q mongodb):/tmp/${BACKUP_NAME}.tar.gz ${BACKUP_DIR}/

# Clean up container
docker-compose exec -T mongodb rm -rf /tmp/${BACKUP_NAME}*

# Remove old backups (keep last 30 days)
echo "🧹 Cleaning old backups..."
find ${BACKUP_DIR} -name "enw_backup_*.tar.gz" -mtime +${BACKUP_RETENTION_DAYS:-30} -delete

echo "✅ Backup completed: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"