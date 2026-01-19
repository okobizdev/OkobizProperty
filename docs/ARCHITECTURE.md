
# Docker + CI/CD System Architecture

## 📦 Complete File Structure

```
okobiz-property/
│
├── 📁 client/                      # Next.js Frontend Application
│   ├── Dockerfile                  # Production-ready multi-stage build
│   ├── .dockerignore              # Files to exclude from Docker context
│   ├── .env.example               # Environment variable template
│   ├── next.config.ts             # Next.js configuration (with standalone output)
│   ├── package.json
│   ├── server.mjs                 # Custom Next.js server
│   ├── src/                       # Source code
│   └── public/                    # Static assets
│
├── 📁 admin/                       # React + Vite Admin Panel
│   ├── Dockerfile                  # Multi-stage build with NGINX
│   ├── .dockerignore              # Files to exclude from Docker context
│   ├── .env.example               # Environment variable template
│   ├── nginx.conf                 # NGINX config for serving SPA
│   ├── vite.config.js             # Vite build configuration
│   ├── package.json
│   └── src/                       # Source code
│
├── 📁 server/                      # Node.js + TypeScript API
│   ├── Dockerfile                  # Multi-stage TypeScript build
│   ├── .dockerignore              # Files to exclude from Docker context
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   ├── tsconfig.json              # TypeScript configuration
│   ├── src/                       # TypeScript source code
│   ├── dist/                      # Compiled JavaScript (auto-generated)
│   ├── logs/                      # Application logs (Docker volume)
│   ├── uploads/                   # File uploads (Docker volume)
│   └── public/                    # Static files
│
├── 📁 nginx/                       # NGINX Reverse Proxy
│   ├── nginx.conf                 # Main NGINX configuration
│   ├── conf.d/
│   │   └── default.conf           # Virtual host configuration
│   └── ssl/                       # SSL certificates (production)
│       ├── fullchain.pem          # (Not in repo - add in production)
│       └── privkey.pem            # (Not in repo - add in production)
│
├── 📁 .github/
│   └── workflows/                 # GitHub Actions CI/CD
│       ├── ci.yml                 # Build and test workflow
│       ├── docker.yml             # Docker image build and push
│       └── deploy.yml             # VPS deployment workflow
│
├── 📁 docs/                        # Documentation
│   ├── HEALTH_CHECKS.md           # Health check endpoints
│   └── ARCHITECTURE.md            # This file
│
├── 📄 docker-compose.yml           # Production orchestration
├── 📄 docker-compose.dev.yml       # Development overrides
├── 📄 Makefile                     # Convenience commands
├── 📄 .env.example                 # Root environment template
├── 📄 .gitignore                  # Git ignore patterns
├── 📄 README.md                    # Project overview
└── 📄 DEPLOYMENT.md                # Detailed deployment guide
```

---

## 🏗️ System Components

### 1. **Dockerfiles**

#### Client Dockerfile (Next.js)
- **Stage 1 (deps)**: Install production dependencies
- **Stage 2 (builder)**: Install all deps and build Next.js
- **Stage 3 (runner)**: Production runtime with standalone output
- **Features**:
  - Non-root user (nextjs:nodejs)
  - Health check endpoint
  - Optimized multi-stage build
  - Node 20 Alpine base

#### Admin Dockerfile (React + Vite)
- **Stage 1 (deps)**: Install production dependencies
- **Stage 2 (builder)**: Build Vite static assets
- **Stage 3 (runner)**: NGINX Alpine serving static files
- **Features**:
  - Non-root nginx user
  - Custom nginx.conf for SPA routing
  - Health check endpoint
  - Gzip compression

#### Server Dockerfile (Node.js + TypeScript)
- **Stage 1 (deps)**: Install production dependencies
- **Stage 2 (builder)**: Compile TypeScript to JavaScript
- **Stage 3 (runner)**: Production runtime
- **Features**:
  - Non-root user (nodejs)
  - dumb-init for proper signal handling
  - Health check endpoint
  - Persistent volumes for logs/uploads

---

### 2. **Docker Compose**

#### docker-compose.yml (Production)
```yaml
Services:
  - mongodb      # Local database (persistent volume)
  - server       # API backend
  - client       # Next.js frontend
  - admin        # React admin panel
  - nginx        # Reverse proxy

Networks:
  - okobiz-property-network (bridge)

Volumes:
  - mongodb-data        # Database persistence
  - server-uploads      # File uploads
  - server-logs         # Application logs
```

#### docker-compose.dev.yml (Development)
- Overrides for hot-reload
- Mounts source code as volumes
- Development environment variables
- Alternative ports to avoid conflicts

---

### 3. **NGINX Configuration**

#### Main Features:
- **Reverse Proxy**: Routes traffic to services
- **Load Balancing**: Upstream with keepalive
- **Security Headers**: X-Frame-Options, CSP, etc.
- **Rate Limiting**: Protects against abuse
- **Gzip Compression**: Reduces bandwidth
- **SSL/TLS Ready**: Commented HTTPS config

#### Routing:
```
/           → client:3000     (Main site)
/admin      → admin:3001      (Admin panel)
/api        → server:5000     (API backend)
/uploads    → Volume mount    (Static files)
/health     → NGINX itself    (Health check)
```

---

### 4. **CI/CD Workflows**

#### ci.yml - Continuous Integration
**Triggers**: Push to main/develop, Pull Requests

**Jobs**:
1. **client-ci**: Lint → Build → Upload artifacts
2. **admin-ci**: Lint → Build → Upload artifacts
3. **server-ci**: Compile TypeScript → Upload artifacts
4. **ci-summary**: Aggregate results

**Features**:
- Monorepo-aware (separate working directories)
- Dependency caching
- Parallel execution
- Artifact retention (7 days)

#### docker.yml - Docker Build & Push
**Triggers**: Push to main, Tags (v*), Manual dispatch

**Jobs**:
1. **build-client**: Build → Tag → Push to Docker Hub
2. **build-admin**: Build → Tag → Push to Docker Hub
3. **build-server**: Build → Tag → Push to Docker Hub
4. **docker-summary**: Aggregate results

**Features**:
- Multi-platform builds (optional)
- Layer caching for faster builds
- Semantic versioning support
- Latest tag on main branch

#### deploy.yml - VPS Deployment
**Triggers**: Manual dispatch, Push to main

**Jobs**:
1. **deploy**: 
   - Setup SSH
   - Copy configs to VPS
   - Create .env from secrets
   - Pull latest images
   - Stop old containers
   - Start new containers
   - Wait for health checks
   - Cleanup old images

2. **health-check**:
   - Verify all endpoints
   - Post-deployment validation

**Features**:
- Zero-downtime deployment
- Rollback capability
- Health validation
- Automated cleanup

---

### 5. **Environment Strategy**

#### Hierarchy:
```
1. .env                    (Root - Docker Compose variables)
2. client/.env.local       (Next.js - NEXT_PUBLIC_* vars)
3. admin/.env              (Vite - VITE_* vars)
4. server/.env             (Node.js - All backend vars)
```

#### Security:
- ✅ No secrets in code
- ✅ `.env` in `.gitignore`
- ✅ `.env.example` templates provided
- ✅ GitHub Secrets for CI/CD
- ✅ Separate dev/prod configurations

---

### 6. **Network Architecture**

#### Docker Internal Network:
```
okobiz-property-network (bridge)
├── client:3000
├── admin:3001
├── server:5000
├── mongodb:27017
└── nginx:80/443
```

#### Service Communication:
- **Internal**: Services use Docker service names (e.g., `http://server:5000`)
- **External**: Users access via NGINX (e.g., `http://domain.com/api`)
- **Database**: Server connects to `mongodb://mongodb:27017`
- **Redis**: Server connects to cloud Redis (external)

---

### 7. **Data Persistence**

#### Docker Volumes:
- **mongodb-data**: Database files (survives container restarts)
- **server-uploads**: User uploaded files
- **server-logs**: Application logs

#### Backup Strategy:
```bash
# MongoDB backup
docker-compose exec mongodb mongodump --out=/backup
docker cp okobiz-mongodb:/backup ./backup-YYYYMMDD

# Uploads backup
tar -czf uploads-backup.tar.gz uploads/
```

---

### 8. **Health Checks**

All services implement health checks:

| Service | Endpoint | Interval | Timeout |
|---------|----------|----------|---------|
| NGINX | `/health` | 30s | 10s |
| Client | `/` | 30s | 10s |
| Admin | `/health` | 30s | 10s |
| Server | `/api/v1/health` | 30s | 10s |
| MongoDB | mongosh ping | 10s | 5s |

**Purpose**:
- Container orchestration
- Dependency management
- Load balancer integration
- Monitoring & alerting

---

## 🔄 Deployment Flow

### Development:
```
1. Developer commits code
2. GitHub Actions triggers CI
3. CI runs lint + build + tests
4. Artifacts uploaded
```

### Production:
```
1. Merge to main branch
2. GitHub Actions triggers Docker workflow
3. Build images → Push to Docker Hub
4. GitHub Actions triggers Deploy workflow
5. SSH to VPS
6. Pull latest images
7. docker-compose down
8. docker-compose up -d
9. Health checks validate deployment
10. Cleanup old images
```

---

## 🔐 Security Features

1. **Container Security**:
   - Non-root users in all containers
   - Read-only root filesystems where possible
   - Limited container capabilities
   - No privileged containers

2. **Network Security**:
   - Isolated Docker network
   - No direct external access to backend services
   - NGINX as single entry point
   - Rate limiting on API endpoints

3. **Secret Management**:
   - Environment variables for secrets
   - GitHub Secrets for CI/CD
   - No secrets in code or images
   - Separate dev/prod credentials

4. **NGINX Security**:
   - Security headers (X-Frame-Options, CSP, etc.)
   - Rate limiting
   - Request size limits
   - SSL/TLS support (production)

---

## 📊 Monitoring & Logging

### Logs:
```bash
# View all logs
docker-compose logs -f

# Service-specific
docker-compose logs -f server

# Export logs
docker-compose logs > logs-YYYYMMDD.log
```

### Metrics:
```bash
# Resource usage
docker stats

# Container info
docker-compose ps
docker inspect <container>
```

### Health Monitoring:
```bash
# Manual checks
curl http://localhost/health
curl http://localhost:5000/api/v1/health

# Automated (add to cron)
*/5 * * * * curl -f http://localhost/health || alert
```

---

## 🚀 Scaling Considerations

### Current Setup:
- Single instance of each service
- Suitable for small to medium traffic

### Future Scaling Options:

1. **Horizontal Scaling**:
   ```yaml
   server:
     deploy:
       replicas: 3  # Multiple server instances
   ```

2. **Load Balancing**:
   - NGINX already configured for upstream load balancing
   - Add more upstream servers as needed

3. **Database Scaling**:
   - MongoDB replica set
   - Sharding for large datasets

4. **Caching**:
   - Redis already integrated
   - Add Redis cluster for HA

5. **CDN**:
   - CloudFront / Cloudflare for static assets
   - Reduce origin server load

---

## 🛠️ Maintenance

### Regular Tasks:

**Daily**:
- Monitor logs for errors
- Check disk space
- Verify health checks

**Weekly**:
- Review resource usage
- Update dependencies
- Backup database

**Monthly**:
- Security updates
- Performance optimization
- Review and rotate logs

**As Needed**:
- Scale services
- Update configurations
- SSL certificate renewal

---

## 📈 Performance Optimization

1. **Build Optimization**:
   - Multi-stage Dockerfiles (smaller images)
   - Layer caching
   - .dockerignore to reduce context

2. **Runtime Optimization**:
   - Production builds (minified, tree-shaken)
   - Gzip compression
   - Static asset caching
   - Connection pooling (MongoDB, Redis)

3. **Network Optimization**:
   - Keep-alive connections
   - HTTP/2 support (with SSL)
   - CDN for static assets

---

## 🔧 Troubleshooting Guide

See [DEPLOYMENT.md](../DEPLOYMENT.md) for comprehensive troubleshooting.

**Quick Diagnostics**:
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f [service]

# Restart problematic service
docker-compose restart [service]

# Rebuild specific service
docker-compose up --build -d [service]

# Check network
docker network inspect okobiz-property-network
```

---

## 📝 Notes

- All services use Node.js 20 LTS Alpine images
- MongoDB 7.0 for database
- NGINX Alpine for reverse proxy
- Redis is external (cloud-hosted)
- Designed for Ubuntu VPS deployment
- SSL/TLS ready (requires certificates)

---

**Document Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: Okobiz Development Team
