.DEFAULT_GOAL := help

.PHONY: build clean format format-check help install serve validate convert-assets-new-to-webp

install: ## Instala as dependencias Node do build
	npm ci

build: ## Gera os arquivos finais do site
	node scripts/build-blog.mjs

format: ## Formata os arquivos HTML e JavaScript de origem
	npm run format

format-check: ## Verifica a formatacao dos arquivos HTML e JavaScript de origem
	npm run format:check

clean: ## Remove os arquivos gerados
	rm -rf dist

convert-assets-new-to-webp: ## Converte arquivos em assets/new para WebP e remove os originais
	bash scripts/convert-assets-new-to-webp.sh assets/new

serve: build ## Inicia um servidor local para testar o site em http://localhost:8080
	python3 -m http.server 8080 --directory dist

validate: build ## Valida o site gerado, verificando se há erros de sintaxe e links quebrados
	node scripts/validate-site.mjs
	npm run format:check
	node --check scripts/build-blog.mjs
	node --check scripts/build-faq.mjs
	node --check scripts/minify-html.mjs
	node --check scripts/validate-site.mjs

help: ## Exibe a lista de comandos disponíveis
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_.-]+:.*##/ {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
