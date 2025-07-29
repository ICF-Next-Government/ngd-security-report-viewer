SERVICE_NAME := AuditLens

.PHONY: start
start:
	@bun i
	@bun run build
	@DOCKER_BUILDKIT=1 docker compose up service -d

.PHONY: build
build:
	@bun i
	@rm -rfv dist
	@bun run build
	@DOCKER_BUILDKIT=1 docker compose build service

.PHONY: ssh
ssh:
	@docker container run -it $(SERVICE_NAME) bash

.PHONY: clean
clean:
	@rm -rfv dist node_modules

.PHONY: nuke
nuke:
	@docker compose down
	@docker compose stop service
	@docker compose rm service
	@docker rmi $(shell docker images --filter reference=$(SERVICE_NAME) -qa) -f

.PHONY: rebuild
rebuild: nuke clean build
