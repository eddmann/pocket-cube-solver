IMAGE = rust:1.51.0-buster
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

.PHONY: test
test:
	$(DOCKER) $(IMAGE) cargo test

.PHONY: build
build:
	$(DOCKER) $(IMAGE) bash -c "cargo install wasm-pack && wasm-pack build"

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) bash
