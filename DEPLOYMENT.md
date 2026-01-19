# 🚀 Okobiz Property - Deployment Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Environment Setup](#environment-setup)
5. [Local Development with Docker](#local-development-with-docker)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## 🏗️ Project Overview

This is a **monorepo** containing three interconnected applications:

```
okobiz-property/
├── client/          # Next.js (User-facing frontend)
├── admin/           # React + Vite (Admin panel)
├── server/          # Node.js + TypeScript (API backend)
├── nginx/           # NGINX reverse proxy configuration
├── docker-compose.yml
└── .github/workflows/  # CI/CD pipelines
```

### Technology Stack

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **Client** | Next.js 15.3 | 3000 | User-facing property rental platform |
| **Admin** | React 18 + Vite 6 | 3001 | Administrative dashboard |
| **Server** | Node.js 20 + TypeScript | 5000 | RESTful API backend |
| **MongoDB** | MongoDB 7.0 | 27017 | Database (local Docker) |
| **Redis** | Cloud Redis | - | Caching (external) |
| **NGINX** | NGINX Alpine | 80/443 | Reverse proxy & load balancer |

---

## 🏛️ Architecture

### System Architecture

```
                        ┌─────────────────┐
                        │   Internet      │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  NGINX :80/443  │
                        │ (Reverse Proxy) │
                        └────────┬────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        ┌────────▼────────┐ ┌───▼────┐ ┌───────▼───────┐
        │  Client :3000   │ │ Admin  │ │ Server :5000  │
        │    (Next.js)    │ │ :3001  │ │   (Node.js)   │
        └─────────────────┘ └────────┘ └───────┬───────┘
                                               │
                                 ┌─────────────┼─────────────┐
                                 │             │             │
                          ┌──────▼──────┐ ┌───▼───┐  ┌─────▼─────┐
                          │   MongoDB   │ │ Redis │  │Cloudinary │
                          │   :27017    │ │(Cloud)│  │  (Cloud)  │
                          └─────────────┘ └───────┘  └───────────┘
```

### Docker Network

All services communicate via a custom Docker bridge network: `okobiz-property-network`

**Internal Service Communication:**
- `http://client:3000` - Client service
- `http://admin:3001` - Admin service
- `http://server:5000` - API service
- `mongodb://mongodb:27017` - Database

**External Access (via NGINX):**
- `/` → Client (Main site)
- `/admin` → Admin panel
- `/api` → Server API
- `/uploads` → Static file server

---

## ✅ Prerequisites

### Required Software

1. **Docker & Docker Compose**
   ```bash
   # Check versions
   docker --version          # ≥ 24.0
   docker-compose --version  # ≥ 2.20
   ```

2. **Node.js** (for local development without Docker)
   ```bash
   node --version  # v20.x LTS
   npm --version   # ≥ 10.x
   ```

3. **Git**
   ```bash
   git --version  # ≥ 2.30
   ```

### VPS Requirements (Production)

- **OS**: Ubuntu 22.04 LTS or later
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 20GB+ available space
- **Network**: Static IP address
- **Ports**: 80, 443 open for HTTP/HTTPS

---

## ⚙️ Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/okobizdev/OkobizProperty.git
cd okobiz-property
```

### 2. Create Environment Files

#### Root Environment (.env)

```bash
cp .env.example .env
```

**Edit `.env` and configure:**

```bash
# CRITICAL: Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set the following in `.env`:
- MongoDB credentials
- Redis URI (from cloud provider)
- JWT secrets (use generated values above)
- SMTP configuration
- Admin account credentials

#### Service-Specific Environments

```bash
# Client
cp client/.env.example client/.env.local

# Admin
cp admin/.env.example admin/.env

# Server
cp server/.env.example server/.env
```

### 3. Directory Structure Verification

Ensure these directories exist:

```bash
mkdir -p nginx/conf.d nginx/ssl
mkdir -p server/logs server/uploads server/public
```

---

## 🐳 Local Development with Docker

### Quick Start

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### Access Applications

| Service | URL | Credentials |
|---------|-----|-------------|
| Client | http://localhost:3000 | N/A |
| Admin | http://localhost:3001 | From `.env` |
| API | http://localhost:5000/api/v1 | N/A |
| MongoDB | mongodb://localhost:27017 | From `.env` |

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f                # All services
docker-compose logs -f server         # Specific service

# Check service status
docker-compose ps

# Restart a service
docker-compose restart server

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Build without cache
docker-compose build --no-cache

# Execute commands in container
docker-compose exec server sh
docker-compose exec mongodb mongosh
```

### Development Workflow

1. **Make code changes** in your local files
2. **Rebuild affected service**:
   ```bash
   docker-compose up --build client  # If client changed
   docker-compose up --build server  # If server changed
   ```
3. **View logs** for debugging:
   ```bash
   docker-compose logs -f [service-name]
   ```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

Three automated workflows are configured:

#### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Triggers**: Push to `main`/`develop`, Pull requests

**Steps**:
- ✅ Lint code
- ✅ Install dependencies
- ✅ Build all services
- ✅ Upload build artifacts

#### 2. **Docker Workflow** (`.github/workflows/docker.yml`)

**Triggers**: Push to `main`, manual dispatch

**Steps**:
- 🐳 Build Docker images
- 🚀 Push to Docker Hub
- 🏷️ Tag with version/branch
- 💾 Cache layers for faster builds

#### 3. **Deploy Workflow** (`.github/workflows/deploy.yml`)

**Triggers**: Manual dispatch, push to `main`

**Steps**:
- 📦 Pull latest images
- 🔄 Stop old containers
- 🚀 Start new containers
- ✅ Health checks
- 🧹 Cleanup old images

### Required GitHub Secrets

Configure these in: **Settings → Secrets and variables → Actions**

#### Docker Hub
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token

#### VPS Access
- `VPS_HOST` - VPS IP address
- `VPS_USER` - SSH username
- `VPS_SSH_PRIVATE_KEY` - SSH private key

#### Application Secrets
- `MONGODB_URI`
- `REDIS_URI`
- `JWT_ACCESS_TOKEN_SECRET_KEY`
- `JWT_REFRESH_TOKEN_SECRET_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- `CLIENT_BASE_URL`, `SERVER_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_ADMIN_URL`
- `VITE_API_BASE_URL`
- `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`

---

## 🌐 Production Deployment

### VPS Initial Setup

#### 1. Install Docker on Ubuntu

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

#### 2. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check status
sudo ufw status
```

#### 3. Setup SSH Key Authentication

```bash
# On your local machine, generate SSH key
ssh-keygen -t ed25519 -C "github-actions"

# Copy public key to VPS
ssh-copy-id user@your-vps-ip

# Test connection
ssh user@your-vps-ip
```

Add the **private key** to GitHub Secrets as `VPS_SSH_PRIVATE_KEY`

### Manual Deployment

If not using GitHub Actions:

```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/okobizdev/OkobizProperty.git
cd OkobizProperty

# Create .env file (copy content from local)
nano .env

# Pull latest images
docker compose pull

# Start services
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

### SSL/TLS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

**Update `nginx/conf.d/default.conf`:**
- Uncomment HTTPS server block
- Update paths to SSL certificates
- Enable HTTP → HTTPS redirect

**Mount certificates in docker-compose.yml:**

```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/nginx/ssl:ro
```

Restart NGINX:
```bash
docker compose restart nginx
```

### Domain Configuration

Point your domain DNS to VPS IP:

```
A     @              YOUR_VPS_IP
A     www            YOUR_VPS_IP
CNAME api            yourdomain.com
CNAME admin          yourdomain.com
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**

**Symptom**: `Error: bind: address already in use`

**Solution**:
```bash
# Find process using the port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

#### 2. **MongoDB Connection Failed**

**Symptom**: `MongoNetworkError: failed to connect to server`

**Solution**:
```bash
# Check MongoDB is running
docker compose ps mongodb

# Check logs
docker compose logs mongodb

# Verify connection string in .env
# For Docker: mongodb://admin:password@mongodb:27017/properties?authSource=admin
```

#### 3. **NGINX 502 Bad Gateway**

**Symptom**: NGINX shows 502 error

**Solution**:
```bash
# Check backend services are running
docker compose ps

# Check backend logs
docker compose logs server
docker compose logs client

# Verify service names in nginx config match docker-compose service names
```

#### 4. **Environment Variables Not Loading**

**Symptom**: App shows undefined for env vars

**Solution**:
```bash
# Rebuild with no cache
docker compose build --no-cache

# Verify .env file exists
ls -la .env

# For Next.js, vars must be prefixed with NEXT_PUBLIC_
# For Vite, vars must be prefixed with VITE_
```

#### 5. **Build Fails - Out of Memory**

**Symptom**: Docker build killed

**Solution**:
```bash
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory: 4GB+

# Or build with reduced parallelism
docker compose build --parallel 1
```

### Debugging Commands

```bash
# Check service health
docker compose ps

# View real-time logs
docker compose logs -f --tail=100

# Inspect container
docker compose exec server sh
docker inspect okobiz-server

# Check network connectivity
docker compose exec client ping server
docker compose exec server ping mongodb

# View Docker networks
docker network ls
docker network inspect okobiz-property-network

# Check disk space
df -h
docker system df

# Cleanup unused resources
docker system prune -a
```

---

## 🔧 Maintenance

### Regular Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up --build -d

# Check for updates
docker compose pull
```

### Backup MongoDB

```bash
# Create backup
docker compose exec mongodb mongodump \
  --uri="mongodb://admin:password@localhost:27017/properties?authSource=admin" \
  --out=/backup

# Copy backup from container
docker cp okobiz-mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)

# Restore backup
docker compose exec mongodb mongorestore \
  --uri="mongodb://admin:password@localhost:27017" \
  /backup
```

### Monitor Logs

```bash
# View logs with timestamps
docker compose logs -f --timestamps

# Export logs
docker compose logs > app-logs-$(date +%Y%m%d).log

# Rotate logs (add to crontab)
0 0 * * * docker compose logs --since 24h > /var/log/okobiz/app-$(date +\%Y\%m\%d).log
```

### Security Updates

```bash
# Update base images
docker compose pull

# Update system packages
sudo apt update && sudo apt upgrade -y

# Renew SSL certificates
sudo certbot renew
```

### Performance Monitoring

```bash
# Container stats
docker stats

# Resource usage
docker compose top

# System info
docker system info
```

---

## 📞 Support

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 502 | Bad Gateway | Backend service down |
| 503 | Service Unavailable | Service starting/restarting |
| 504 | Gateway Timeout | Backend taking too long |
| ECONNREFUSED | Connection refused | Service not running |
| ETIMEDOUT | Connection timeout | Network/firewall issue |

### Getting Help

1. Check logs: `docker compose logs -f`
2. Verify environment variables
3. Check service health: `docker compose ps`
4. Review this documentation
5. Check GitHub Issues

---

## 🎯 Quick Reference

### Environment URLs

**Development**:
- Client: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000/api/v1

**Production**:
- Client: https://yourdomain.com
- Admin: https://yourdomain.com/admin
- API: https://yourdomain.com/api/v1

### Essential Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Rebuild
docker compose up --build -d

# Logs
docker compose logs -f [service]

# Shell
docker compose exec [service] sh

# Restart
docker compose restart [service]
```

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintainer**: Okobiz Development Team
