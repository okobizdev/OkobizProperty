# Health Check Endpoints

## Overview

Each service in the Okobiz Property platform exposes health check endpoints for monitoring and orchestration.

## Endpoints

### NGINX
- **Endpoint**: `http://localhost/health`
- **Method**: GET
- **Response**: `200 OK` with plain text "healthy"
- **Purpose**: Overall system health

### Client (Next.js)
- **Endpoint**: `http://localhost:3000` (root)
- **Method**: GET
- **Response**: `200 OK` if Next.js is running
- **Docker Healthcheck**: Executes Node.js HTTP GET

### Admin (React + Vite)
- **Endpoint**: `http://localhost:3001/health`
- **Method**: GET
- **Response**: `200 OK` with plain text "healthy"
- **Note**: Served by admin's nginx.conf

### Server (Node.js API)
- **Endpoint**: `http://localhost:5000/api/v1/health`
- **Method**: GET
- **Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T...",
  "service": "okobiz-property-api"
}
```

### MongoDB
- **Internal Check**: `mongosh` ping command
- **Not exposed externally**
- **Docker Healthcheck**: `db.runCommand("ping").ok`

## Usage

### Manual Health Check
```bash
# Check all services
curl http://localhost/health              # NGINX
curl http://localhost:3000                # Client
curl http://localhost:3001/health         # Admin  
curl http://localhost:5000/api/v1/health  # Server API
```

### Docker Health Status
```bash
# View health status
docker-compose ps

# Services show as "healthy" or "unhealthy"
```

### Automated Monitoring
Add to cron or monitoring tools:
```bash
*/5 * * * * curl -f http://localhost/health || echo "Service down" | mail -s "Alert" admin@example.com
```

## Health Check Configuration

### docker-compose.yml
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s      # Check every 30 seconds
  timeout: 10s       # 10 second timeout
  retries: 3         # Retry 3 times before marking unhealthy
  start_period: 40s  # Grace period on container start
```

## Troubleshooting

### Service Shows as Unhealthy

1. **Check logs**:
   ```bash
   docker-compose logs [service-name]
   ```

2. **Verify endpoint manually**:
   ```bash
   docker-compose exec [service-name] curl http://localhost:[port]/health
   ```

3. **Restart service**:
   ```bash
   docker-compose restart [service-name]
   ```

### MongoDB Healthcheck Failing

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Test ping
db.runCommand({ ping: 1 })
```

## Integration with Load Balancers

For production load balancers (AWS ALB, HAProxy, etc.), configure:
- **Health Check Path**: `/health` or `/api/v1/health`
- **Interval**: 30 seconds
- **Timeout**: 5 seconds
- **Healthy Threshold**: 2
- **Unhealthy Threshold**: 3

## Notes

- Health checks run continuously in Docker
- Failed checks trigger container restart (if `restart: unless-stopped`)
- Dependent services wait for upstream health before starting
- NGINX health endpoint returns 200 even if backends are down (by design)
