# ⚡ Quick Setup Guide - Okobiz Property

## 🎯 Goal
Get the entire Okobiz Property platform running in **under 10 minutes**.

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- [ ] Docker installed (`docker --version`)
- [ ] Docker Compose installed (`docker-compose --version`)
- [ ] Git installed
- [ ] At least 4GB RAM available
- [ ] 10GB free disk space

---

## 🚀 Setup Steps

### 1. Clone Repository (30 seconds)

```bash
git clone https://github.com/okobizdev/OkobizProperty.git
cd okobiz-property
```

### 2. Create Environment Files (2 minutes)

```bash
# Copy templates
cp .env.example .env
cp client/.env.example client/.env.local
cp admin/.env.example admin/.env
cp server/.env.example server/.env
```

**Edit `.env` with your secrets:**

```bash
# Generate secure JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste as JWT_ACCESS_TOKEN_SECRET_KEY

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste as JWT_REFRESH_TOKEN_SECRET_KEY
```

**Minimum required changes in `.env`:**
```env
# MongoDB (keep defaults for local Docker)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123

# JWT (paste generated secrets)
JWT_ACCESS_TOKEN_SECRET_KEY=paste_generated_secret_here
JWT_REFRESH_TOKEN_SECRET_KEY=paste_generated_secret_here

# Redis (get from your cloud provider)
REDIS_URI=redis://default:password@your-redis-host:port

# SMTP (for emails)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Admin account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChangeMe123!
ADMIN_NAME=Administrator
```

### 3. Start Services (5 minutes - first build)

```bash
# Build and start all services
docker-compose up --build -d

# Watch logs to see progress
docker-compose logs -f
```

**Wait for**: "✅ All services started successfully"

### 4. Verify Services (30 seconds)

```bash
# Check all containers are running
docker-compose ps

# Should see:
# - okobiz-client (healthy)
# - okobiz-admin (healthy)
# - okobiz-server (healthy)
# - okobiz-mongodb (healthy)
# - okobiz-nginx (healthy)
```

### 5. Access Applications

Open in browser:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Site** | http://localhost:3000 | N/A |
| **Admin Panel** | http://localhost:3001 | From `.env` |
| **API Docs** | http://localhost:5000/api/v1 | N/A |
| **NGINX** | http://localhost | Routes all |

---

## 🎉 Success!

If you can access all URLs above, you're done! 

The platform is now running with:
- ✅ Next.js client
- ✅ React admin panel
- ✅ Node.js API
- ✅ MongoDB database
- ✅ NGINX reverse proxy

---

## 📝 Quick Commands

```bash
# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Rebuild a service
docker-compose up --build -d [service-name]

# Clean everything (⚠️ deletes data)
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process
sudo lsof -i :3000
kill -9 <PID>
```

### Services Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]
```

### MongoDB Connection Issues

```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Environment Variables Not Loading

```bash
# Rebuild with no cache
docker-compose build --no-cache

# Restart all services
docker-compose up -d
```

---

## 🔧 Development Mode

For hot-reload during development:

```bash
# Stop production containers
docker-compose down

# Start in dev mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## 🌐 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- VPS setup
- SSL/TLS configuration
- GitHub Actions CI/CD
- Backup strategies
- Monitoring setup

---

## 📚 Additional Resources

- **[README.md](./README.md)** - Project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full deployment guide
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture
- **[HEALTH_CHECKS.md](./docs/HEALTH_CHECKS.md)** - Health endpoints

---

## 💡 Pro Tips

1. **Use Makefile shortcuts**:
   ```bash
   make quick-start  # Setup env + start services
   make logs         # View all logs
   make health       # Check service health
   make clean        # Complete cleanup
   ```

2. **Monitor resource usage**:
   ```bash
   docker stats
   ```

3. **Backup before major changes**:
   ```bash
   make mongo-backup
   ```

4. **Keep images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

---

## 🆘 Need Help?

- Check logs: `docker-compose logs -f`
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Open GitHub issue
- Contact: dev.okobiz@gmail.com

---

**Setup Time**: ~10 minutes  
**Difficulty**: Beginner  
**Last Updated**: January 2026
