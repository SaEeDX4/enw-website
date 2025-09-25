# ENW Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development only)
- Domain name (for production)
- SSL certificate (for HTTPS)

## Database Options

You must choose ONE database option:

### Option A: MongoDB Atlas (Recommended for Production)

- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get your connection string
- Add to `.env.production`: `MONGODB_URI=your-connection-string`
- Use `docker-compose.atlas.yml` for deployment

### Option B: Local MongoDB Container

- No external accounts needed
- MongoDB runs in Docker container
- Configure `MONGO_USERNAME` and `MONGO_PASSWORD` in `.env.production`
- Use `docker-compose.yml` for deployment

## Deployment Steps

### 1. Clone Repository

```bash
git clone https://github.com/your-org/enw-website.git
cd enw-website
```
