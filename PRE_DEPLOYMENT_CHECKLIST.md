# ✅ Pre-Deployment Checklist

Use this checklist to ensure everything is properly configured before deploying to production.

---

## 📋 Environment Configuration

### Root Directory
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB credentials (`MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`)
- [ ] Generate and set JWT secrets (32+ characters each)
- [ ] Configure Redis URI (from cloud provider)
- [ ] Set SMTP credentials for email
- [ ] Configure admin account credentials
- [ ] Update URLs for production domain

### Client Directory
- [ ] Copy `client/.env.example` to `client/.env.local`
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` (production domain)
- [ ] Set `NEXT_PUBLIC_API_ADMIN_URL` (production domain)
- [ ] Set `NODE_ENV=production`

### Admin Directory
- [ ] Copy `admin/.env.example` to `admin/.env`
- [ ] Set `VITE_API_BASE_URL` (production domain)

### Server Directory
- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Set all database credentials
- [ ] Configure Redis URI
- [ ] Set JWT secrets (same as root `.env`)
- [ ] Configure SMTP settings
- [ ] Update production URLs

---

## 🔐 GitHub Secrets Configuration

Navigate to: **Repository → Settings → Secrets and variables → Actions**

### Docker Hub
- [ ] `DOCKER_USERNAME` - Your Docker Hub username
- [ ] `DOCKER_PASSWORD` - Docker Hub personal access token

### VPS Access
- [ ] `VPS_HOST` - Your VPS IP address
- [ ] `VPS_USER` - SSH username (e.g., ubuntu, root)
- [ ] `VPS_SSH_PRIVATE_KEY` - Complete private SSH key

### Database
- [ ] `MONGODB_URI` - Full MongoDB connection string
- [ ] `MONGO_ROOT_USERNAME` - MongoDB root user
- [ ] `MONGO_ROOT_PASSWORD` - MongoDB root password
- [ ] `REDIS_URI` - Redis connection string

### Authentication
- [ ] `JWT_ACCESS_TOKEN_SECRET_KEY` - Access token secret (32+ chars)
- [ ] `JWT_REFRESH_TOKEN_SECRET_KEY` - Refresh token secret (32+ chars)

### Email (SMTP)
- [ ] `SMTP_HOST` - SMTP server host
- [ ] `SMTP_PORT` - SMTP port (587 for TLS)
- [ ] `SMTP_USER` - SMTP username/email
- [ ] `SMTP_PASS` - SMTP password/app password

### Admin Account
- [ ] `ADMIN_EMAIL` - Admin email address
- [ ] `ADMIN_PASSWORD` - Admin password (strong!)
- [ ] `ADMIN_NAME` - Admin display name

### Application URLs
- [ ] `CLIENT_BASE_URL` - Production client URL
- [ ] `SERVER_BASE_URL` - Production API URL
- [ ] `NEXT_PUBLIC_API_BASE_URL` - Public API URL
- [ ] `NEXT_PUBLIC_API_ADMIN_URL` - Public admin URL
- [ ] `VITE_API_BASE_URL` - Vite API URL

---

## 🖥️ VPS Setup

### System Requirements
- [ ] Ubuntu 22.04 LTS or later installed
- [ ] Minimum 4GB RAM available
- [ ] 20GB+ free disk space
- [ ] Static IP address assigned
- [ ] Root or sudo access available

### Software Installation
- [ ] Docker installed (`curl -fsSL https://get.docker.com | sh`)
- [ ] Docker Compose plugin installed
- [ ] User added to docker group (`sudo usermod -aG docker $USER`)
- [ ] Git installed (`sudo apt install git`)

### Network Configuration
- [ ] Firewall configured (UFW)
- [ ] Port 80 open (HTTP)
- [ ] Port 443 open (HTTPS)
- [ ] Port 22 open (SSH)
- [ ] SSH configured for key-based auth

### SSH Setup
- [ ] SSH key pair generated
- [ ] Public key added to VPS (`~/.ssh/authorized_keys`)
- [ ] Private key added to GitHub Secrets
- [ ] SSH connection tested from local machine
- [ ] Password authentication disabled (recommended)

---

## 🌐 Domain & DNS Configuration

### Domain Setup
- [ ] Domain purchased and registered
- [ ] DNS management access available
- [ ] Nameservers configured

### DNS Records
- [ ] A record: `@` → VPS IP
- [ ] A record: `www` → VPS IP
- [ ] CNAME: `api` → `yourdomain.com` (optional)
- [ ] CNAME: `admin` → `yourdomain.com` (optional)
- [ ] DNS propagation complete (use `dig yourdomain.com`)

---

## 🔒 SSL/TLS Configuration (Production Only)

### Certificate Acquisition
- [ ] Certbot installed (`sudo apt install certbot`)
- [ ] Certificate obtained (`sudo certbot certonly --standalone -d yourdomain.com`)
- [ ] Certificate files located in `/etc/letsencrypt/live/yourdomain.com/`
- [ ] Certificate auto-renewal configured

### NGINX Configuration
- [ ] `nginx/conf.d/default.conf` updated with SSL block
- [ ] Certificate paths configured in NGINX
- [ ] HTTP → HTTPS redirect enabled
- [ ] SSL/TLS protocols configured (TLS 1.2+)
- [ ] Strong cipher suites configured

### Docker Compose Update
- [ ] Certificate volume mounted in `docker-compose.yml`:
  ```yaml
  nginx:
    volumes:
      - /etc/letsencrypt:/etc/nginx/ssl:ro
  ```

---

## 🐳 Docker Configuration

### Images
- [ ] All Dockerfiles reviewed
- [ ] `.dockerignore` files in place
- [ ] Build arguments configured
- [ ] Base images verified (Node 20 Alpine, etc.)

### docker-compose.yml
- [ ] All services defined
- [ ] Networks configured
- [ ] Volumes defined
- [ ] Environment variables referenced
- [ ] Health checks configured
- [ ] Restart policies set
- [ ] Port mappings verified

### Local Testing
- [ ] `docker-compose up --build -d` runs successfully
- [ ] All containers show as "healthy"
- [ ] No port conflicts
- [ ] Services can communicate
- [ ] Health endpoints respond

---

## 🧪 Testing

### Local Testing
- [ ] Client accessible at http://localhost:3000
- [ ] Admin accessible at http://localhost:3001
- [ ] API accessible at http://localhost:5000/api/v1
- [ ] NGINX accessible at http://localhost
- [ ] MongoDB connection successful
- [ ] Redis connection successful
- [ ] File uploads work
- [ ] Email sending works
- [ ] Admin login works

### CI/CD Testing
- [ ] Push to `develop` branch triggers CI
- [ ] All CI jobs pass (lint, build, test)
- [ ] Push to `main` triggers Docker build
- [ ] Docker images successfully pushed
- [ ] Manual deployment workflow works

### Production Testing (After Deployment)
- [ ] All services start successfully
- [ ] Health checks pass
- [ ] Client accessible via domain
- [ ] Admin accessible via domain/admin
- [ ] API accessible via domain/api
- [ ] SSL/TLS working (HTTPS)
- [ ] Database operations work
- [ ] File uploads work
- [ ] Email notifications work

---

## 📊 Monitoring Setup

### Health Checks
- [ ] All health endpoints configured
- [ ] Health check intervals appropriate
- [ ] Timeouts configured
- [ ] Retry counts set

### Logging
- [ ] Log volumes configured
- [ ] Log rotation configured (optional)
- [ ] Centralized logging set up (optional)

### Metrics (Optional)
- [ ] Prometheus configured
- [ ] Grafana dashboards created
- [ ] Alerts configured

---

## 🔄 Backup Strategy

### Database Backups
- [ ] Backup script created (`make mongo-backup`)
- [ ] Backup schedule configured (cron)
- [ ] Backup storage location set
- [ ] Backup retention policy defined
- [ ] Restore process tested

### File Backups
- [ ] Upload directory backup configured
- [ ] Backup frequency determined
- [ ] Off-site backup configured (optional)

### Configuration Backups
- [ ] `.env` files backed up securely
- [ ] NGINX configs backed up
- [ ] SSL certificates backed up

---

## 📝 Documentation Review

- [ ] README.md read and understood
- [ ] DEPLOYMENT.md reviewed
- [ ] QUICKSTART.md followed successfully
- [ ] ARCHITECTURE.md understood
- [ ] HEALTH_CHECKS.md reviewed
- [ ] Makefile commands tested

---

## 🚀 Deployment Steps

### Pre-Deployment
- [ ] All checklist items above completed
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled (if needed)
- [ ] Rollback plan documented

### Deployment
- [ ] GitHub Actions deploy workflow triggered
- [ ] Deployment logs monitored
- [ ] Health checks pass
- [ ] Post-deployment tests run
- [ ] Smoke tests completed

### Post-Deployment
- [ ] All services confirmed running
- [ ] Performance metrics checked
- [ ] Error logs reviewed
- [ ] Backup created immediately
- [ ] Team notified of completion
- [ ] Documentation updated (if needed)

---

## 🐛 Emergency Procedures

### Rollback Plan
- [ ] Previous version images available
- [ ] Rollback commands documented:
  ```bash
  docker-compose down
  docker-compose pull [service]:previous-tag
  docker-compose up -d
  ```
- [ ] Database restore procedure documented
- [ ] Rollback contacts identified

### Incident Response
- [ ] On-call rotation defined
- [ ] Escalation path documented
- [ ] Monitoring alerts configured
- [ ] Emergency contacts listed

---

## 📞 Support & Contacts

### Technical Contacts
- [ ] DevOps lead identified
- [ ] Backend developer contact
- [ ] Frontend developer contact
- [ ] Database administrator contact

### External Services
- [ ] Docker Hub support access
- [ ] GitHub support access
- [ ] MongoDB support access (if cloud)
- [ ] Redis support access (if cloud)
- [ ] DNS provider support
- [ ] VPS provider support

---

## ✅ Final Verification

Before going live, verify:

- [ ] All above sections completed
- [ ] Production `.env` files reviewed by 2+ people
- [ ] SSL certificates valid and not expiring soon
- [ ] Backup and restore tested successfully
- [ ] Load testing performed (if applicable)
- [ ] Security scan completed
- [ ] Performance baseline established
- [ ] Monitoring and alerts working
- [ ] Documentation accurate and complete
- [ ] Team trained on operations
- [ ] Emergency procedures tested

---

## 🎉 Go Live!

Once all items are checked:

1. **Trigger deployment** via GitHub Actions
2. **Monitor closely** for first 30 minutes
3. **Run health checks** every 5 minutes
4. **Check logs** for any errors
5. **Test critical paths** (login, signup, key features)
6. **Monitor performance** metrics
7. **Create backup** immediately after successful deployment
8. **Update team** on status

---

## 📅 Post-Launch (First Week)

- [ ] Daily health monitoring
- [ ] Review logs daily
- [ ] Monitor resource usage
- [ ] Check backup success
- [ ] Gather user feedback
- [ ] Performance tuning as needed
- [ ] Security audit
- [ ] Update documentation with lessons learned

---

**Remember**: It's better to delay deployment than to deploy with incomplete configuration. Safety first!

---

**Checklist Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: Okobiz Development Team
