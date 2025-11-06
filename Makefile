SHELL := /bin/sh
COMPOSE := docker compose
ENV_FILE := .env

# Carrega variáveis do .env (opcional, mas útil para smoke tests)
# O "-" evita erro se o .env não existir.
-include $(ENV_FILE)
export

.PHONY: docker_up
docker_up: ## Sobe os serviços em segundo plano (build se necessário)
	@echo "Subindo os serviços com 🐳 Compose..."
	$(COMPOSE) up -d --build

.PHONY: docker_down
docker_down: ## Derruba os serviços (mantém volumes)
	@echo "Derrubando os serviços com 🐳 Compose..."
	$(COMPOSE) down

.PHONY: docker_recreate
docker_recreate: ## Recria TUDO do zero (derruba e apaga volumes), depois sobe
	@echo "Recriando os serviços com 🐳 Compose..."
	$(COMPOSE) down -v --remove-orphans
	$(COMPOSE) up -d --build

.PHONY: docker_restart
docker_restart: ## Reinicia (sem apagar volumes)
	@echo "Reiniciando os serviços com 🐳 Compose..."
	$(COMPOSE) down
	$(COMPOSE) up -d

# -------- Utilidades --------

.PHONY: docker_logs
docker_logs: ## Segue logs de todos os serviços
	$(COMPOSE) logs -f --tail=200

.PHONY: docker_ps
docker_ps: ## Lista serviços em execução
	$(COMPOSE) ps

.PHONY: docker_stop
docker_stop: ## Para os serviços (mantém containers/volumes)
	$(COMPOSE) stop

.PHONY: docker_rm
docker_rm: ## Remove containers parados (mantém volumes)
	$(COMPOSE) rm -f

# -------- Ajuda --------

.PHONY: help
help: ## Mostra esta ajuda
	@awk -F ':.*## ' '/^[a-zA-Z0-9_-]+:.*## / { printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)