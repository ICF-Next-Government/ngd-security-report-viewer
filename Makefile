SERVICE_NAME := sarif-viewer-service

.PHONY: start
start:
	@DOCKER_BUILDKIT=1 docker compose up service -d

.PHONY: build
build:
	@rm -rfv dist
	@bun run build
	@DOCKER_BUILDKIT=1 docker compose build service

.PHONY: ssh
ssh:
	@docker container run -it $(SERVICE_NAME) bash

.PHONY: clean
clean:
	@docker compose down
	@docker compose stop service
	@docker compose rm service
	@docker rmi $(shell docker images --filter reference=$(SERVICE_NAME) -qa) -f

.PHONY: rebuild
rebuild: clean build
