# Okobiz Property - Production Docker Setup

[![CI](https://github.com/okobizdev/OkobizProperty/workflows/CI/badge.svg)](https://github.com/okobizdev/OkobizProperty/actions)
[![Docker](https://github.com/okobizdev/OkobizProperty/workflows/Docker/badge.svg)](https://github.com/okobizdev/OkobizProperty/actions)

> **Complete production-ready Docker + CI/CD setup for Okobiz Property Management Platform**

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/okobizdev/OkobizProperty.git
cd okobiz-property

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

**Access Applications**:
- Client: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000/api/v1
- NGINX: http://localhost (proxies all services)

## 📁 Project Structure

```
okobiz-property/
├── client/              # Next.js frontend (User-facing)
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── admin/               # React + Vite admin panel
│   ├── Dockerfile
│   ├── nginx.conf       # Admin nginx config
│   ├── .dockerignore
│   └── .env.example
├── server/              # Node.js + TypeScript API
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── nginx/               # NGINX reverse proxy
│   ├── nginx.conf
│   └── conf.d/
│       └── default.conf
├── .github/
│   └── workflows/       # CI/CD pipelines
│       ├── ci.yml       # Build & test
│       ├── docker.yml   # Docker image builds
│       └── deploy.yml   # VPS deployment
├── docker-compose.yml   # Multi-service orchestration
├── .env.example         # Environment template
└── DEPLOYMENT.md        # Detailed deployment guide
```

## 🏗️ Architecture

```
Internet → NGINX (:80/443) → Client (:3000)
                         → Admin (:3001)
                         → Server (:5000) → MongoDB (:27017)
                                        → Redis (Cloud)
```

**Services**:
- **Client**: Next.js 15.3 - User-facing property platform
- **Admin**: React 18 + Vite - Admin dashboard
- **Server**: Node.js 20 + TypeScript - REST API
- **MongoDB**: Local database (Docker)
- **Redis**: Cloud caching (external)
- **NGINX**: Reverse proxy & load balancer

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, MongoDB, Redis
- **DevOps**: Docker, Docker Compose, GitHub Actions, NGINX
- **Package Manager**: npm
- **Node Version**: 20 LTS

## 📋 Prerequisites

- Docker >= 24.0
- Docker Compose >= 2.20
- Node.js 20 LTS (for local dev)
- Git >= 2.30

## ⚙️ Configuration

### Environment Variables

1. **Root `.env`** - General configuration
2. **`client/.env.local`** - Next.js environment
3. **`admin/.env`** - Vite environment
4. **`server/.env`** - Backend configuration

See `.env.example` files for required variables.

### Critical Secrets

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use for:
- `JWT_ACCESS_TOKEN_SECRET_KEY`
- `JWT_REFRESH_TOKEN_SECRET_KEY`
- `MONGO_ROOT_PASSWORD`

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f [service]

# Stop services
docker-compose down

# Restart service
docker-compose restart [service]

# Execute command in container
docker-compose exec [service] sh

# View status
docker-compose ps

# Clean up
docker-compose down -v  # ⚠️ Removes volumes
```

## 🔄 CI/CD Pipeline

### Automated Workflows

1. **CI Workflow** - Lint, build, test on push/PR
2. **Docker Workflow** - Build and push images to Docker Hub
3. **Deploy Workflow** - Deploy to VPS via SSH

### GitHub Secrets Required

- `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`
- All environment variables (see `.env.example`)

## 🌐 Production Deployment

### VPS Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and configure
git clone https://github.com/okobizdev/OkobizProperty.git
cd okobiz-property
cp .env.example .env
# Edit .env

# Start services
docker-compose up -d
```

### SSL/TLS (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx/conf.d/default.conf with SSL config
# Restart NGINX
docker-compose restart nginx
```

## 📊 Monitoring & Logs

```bash
# Real-time logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f server

# Container stats
docker stats

# Health check
curl http://localhost/health
```

## 🐛 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
sudo lsof -i :3000
kill -9 <PID>
```

**MongoDB connection issues**:
```bash
docker-compose logs mongodb
docker-compose restart mongodb
```

**NGINX 502 errors**:
```bash
docker-compose ps
docker-compose logs nginx
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[HEALTH_CHECKS.md](./docs/HEALTH_CHECKS.md)** - Health check endpoints
- **API Documentation** - http://localhost:5000/api/docs

## 🔐 Security

- Non-root users in all containers
- Environment variables for secrets
- NGINX security headers
- Rate limiting configured
- Health checks enabled
- No hardcoded credentials

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

Proprietary - Okobiz Development Team

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/okobizdev/OkobizProperty/issues)
- **Email**: dev.okobiz@gmail.com

---

**Built with ❤️ by Okobiz Development Team** 
