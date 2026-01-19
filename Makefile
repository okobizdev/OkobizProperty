# Makefile for Okobiz Property
# Convenience commands for Docker operations

.PHONY: help build up down restart logs shell clean dev prod

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[1;33m
NC := \033[0m # No Color

##@ General Commands

help: ## Display this help message
	@echo "$(GREEN)Okobiz Property - Docker Management$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(BLUE)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

dev: ## Start all services in development mode
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-d: ## Start all services in development mode (detached)
	@echo "$(GREEN)Starting development environment (detached)...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

##@ Production

up: ## Start all services in production mode
	@echo "$(GREEN)Starting production environment...$(NC)"
	docker-compose up --build -d

down: ## Stop all services
	@echo "$(YELLOW)Stopping all services...$(NC)"
	docker-compose down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting all services...$(NC)"
	docker-compose restart

##@ Building

build: ## Build all Docker images
	@echo "$(BLUE)Building all images...$(NC)"
	docker-compose build

build-client: ## Build only client image
	@echo "$(BLUE)Building client image...$(NC)"
	docker-compose build client

build-admin: ## Build only admin image
	@echo "$(BLUE)Building admin image...$(NC)"
	docker-compose build admin

build-server: ## Build only server image
	@echo "$(BLUE)Building server image...$(NC)"
	docker-compose build server

build-no-cache: ## Build all images without cache
	@echo "$(BLUE)Building all images (no cache)...$(NC)"
	docker-compose build --no-cache

##@ Logs & Monitoring

logs: ## View logs from all services
	docker-compose logs -f

logs-client: ## View client logs
	docker-compose logs -f client

logs-admin: ## View admin logs
	docker-compose logs -f admin

logs-server: ## View server logs
	docker-compose logs -f server

logs-mongodb: ## View MongoDB logs
	docker-compose logs -f mongodb

logs-nginx: ## View NGINX logs
	docker-compose logs -f nginx

ps: ## Show running containers
	docker-compose ps

stats: ## Show container resource usage
	docker stats

##@ Shell Access

shell-client: ## Open shell in client container
	docker-compose exec client sh

shell-admin: ## Open shell in admin container
	docker-compose exec admin sh

shell-server: ## Open shell in server container
	docker-compose exec server sh

shell-mongodb: ## Open MongoDB shell
	docker-compose exec mongodb mongosh

shell-nginx: ## Open shell in nginx container
	docker-compose exec nginx sh

##@ Service Management

restart-client: ## Restart client service
	docker-compose restart client

restart-admin: ## Restart admin service
	docker-compose restart admin

restart-server: ## Restart server service
	docker-compose restart server

restart-nginx: ## Restart NGINX service
	docker-compose restart nginx

##@ Database

mongo-shell: ## Access MongoDB shell
	docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

mongo-backup: ## Backup MongoDB database
	@echo "$(BLUE)Creating MongoDB backup...$(NC)"
	docker-compose exec mongodb mongodump --uri="mongodb://admin:admin123@localhost:27017/properties?authSource=admin" --out=/backup
	docker cp okobiz-mongodb:/backup ./mongodb-backup-$$(date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)Backup created successfully!$(NC)"

mongo-restore: ## Restore MongoDB from backup (specify BACKUP_DIR)
	@echo "$(YELLOW)Restoring MongoDB from $(BACKUP_DIR)...$(NC)"
	docker cp $(BACKUP_DIR) okobiz-mongodb:/restore
	docker-compose exec mongodb mongorestore --uri="mongodb://admin:admin123@localhost:27017" /restore

##@ Cleanup

clean: ## Stop and remove all containers, networks, volumes
	@echo "$(RED)Removing all containers, networks, and volumes...$(NC)"
	docker-compose down -v

clean-images: ## Remove all Docker images for this project
	@echo "$(RED)Removing all project images...$(NC)"
	docker images | grep okobiz | awk '{print $$3}' | xargs docker rmi -f

clean-all: clean clean-images ## Complete cleanup (containers, volumes, images)
	@echo "$(GREEN)Cleanup complete!$(NC)"

prune: ## Prune unused Docker resources
	@echo "$(YELLOW)Pruning unused Docker resources...$(NC)"
	docker system prune -af --volumes

##@ Health & Testing

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@echo "NGINX Health:"
	@curl -f http://localhost/health && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"
	@echo ""
	@echo "Client Health:"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"
	@echo ""
	@echo "Admin Health:"
	@curl -f http://localhost:3001/health > /dev/null 2>&1 && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"
	@echo ""
	@echo "Server Health:"
	@curl -f http://localhost:5000/api/v1/health > /dev/null 2>&1 && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"

test: ## Run tests (if configured)
	@echo "$(BLUE)Running tests...$(NC)"
	# Add test commands here

##@ Environment

env-setup: ## Copy all .env.example files to .env
	@echo "$(BLUE)Setting up environment files...$(NC)"
	cp -n .env.example .env || true
	cp -n client/.env.example client/.env.local || true
	cp -n admin/.env.example admin/.env || true
	cp -n server/.env.example server/.env || true
	@echo "$(GREEN)Environment files created! Please edit them with your configuration.$(NC)"

env-validate: ## Validate environment files exist
	@echo "$(BLUE)Validating environment files...$(NC)"
	@test -f .env && echo ".env $(GREEN)✓$(NC)" || echo ".env $(RED)✗ MISSING$(NC)"
	@test -f client/.env.local && echo "client/.env.local $(GREEN)✓$(NC)" || echo "client/.env.local $(RED)✗ MISSING$(NC)"
	@test -f admin/.env && echo "admin/.env $(GREEN)✓$(NC)" || echo "admin/.env $(RED)✗ MISSING$(NC)"
	@test -f server/.env && echo "server/.env $(GREEN)✓$(NC)" || echo "server/.env $(RED)✗ MISSING$(NC)"

##@ Git Operations

git-status: ## Show git status
	git status

git-pull: ## Pull latest changes
	git pull origin main

git-push: ## Push changes to remote
	git push origin main

##@ Quick Actions

quick-start: env-setup up logs ## Quick start: setup env, start services, show logs

reset: down clean up ## Reset: stop, clean, and restart everything

update: git-pull build-no-cache restart ## Update: pull changes, rebuild, restart
