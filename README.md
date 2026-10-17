# sistemalaser-site
Site do Sistema Laser

## Estrutura do build

O arquivo `blog/posts.json` é a fonte de verdade das postagens. Cada entrada tem
metadados de SEO, categoria, tags, chamada, tempo de leitura e o HTML do corpo do
artigo em `contentHtml`.

O arquivo `faq/faq.json` é a fonte de verdade das perguntas frequentes. O build
gera `faq.html`, disponibiliza o JSON em `faq/faq.json` no site público e exibe
em cada página somente as perguntas da seção correspondente.

O comando `make build` gera o site público completo no diretório `dist/`. Esse é
o diretório que deve ser publicado no GitHub Pages.

Principais artefatos gerados:

```text
dist/
  CNAME
  index.html
  blog.html
  blog/
    posts.json
    feed.xml
    nome-do-post.html
  faq/
    faq.json
  faq.html
  assets/
  robots.txt
  sitemap.xml
  llms.txt
```

O arquivo `CNAME` fica versionado na raiz como fonte e é copiado para `dist/`,
para manter a referência do domínio canônico. Com publicação via Actions, o domínio efetivo deve ser configurado também em Settings > Pages; o arquivo CNAME sozinho não altera essa configuração.

## Comandos

```sh
make install
```

Instala as dependências Node necessárias para formatar e compactar as páginas.

```sh
make build
```

Gera as páginas HTML do blog, o feed RSS e o sitemap e compacta todos os arquivos
HTML publicados em `dist/`.

```sh
make format
```

Formata os arquivos HTML e JavaScript de origem. Arquivos legados já minificados
e todo o conteúdo gerado em `dist/` ficam fora dessa formatação.

```sh
make validate
```

Executa o build e valida páginas geradas, Schema.org, links internos e scripts
Node.

```sh
make serve
```

Gera `dist/` e sobe um servidor local em `http://localhost:8083`.

## Teste local

Não teste abrindo `index.html` diretamente pelo navegador, porque páginas como
`blog.html` usam `fetch("blog/posts.json")`. Navegadores bloqueiam esse tipo de
requisição quando o arquivo é aberto via `file://`.

Use um servidor HTTP local:

```sh
make serve
```

Depois acesse:

```text
http://localhost:8083/
http://localhost:8083/blog.html
```

Esse teste serve o conteúdo de `dist/`, ou seja, a mesma estrutura que será
publicada no GitHub Pages.

## GitHub Pages

O site continua estático e compatível com GitHub Pages. O workflow
`.github/workflows/build-site.yml` roda `make validate`, envia `dist/` como
artefato do Pages e publica esse diretório.

### Configuração no GitHub

No repositório, configure o Pages para publicar via GitHub Actions:

1. Acesse `Settings` > `Pages`.
2. Em `Build and deployment`, selecione `Source: GitHub Actions`.
3. Mantenha o arquivo `CNAME` na raiz do projeto com o domínio
   `www.sistemalaser.com.br`. Em `Settings` > `Pages`, configure o mesmo
   domínio em `Custom domain` e marque `Enforce HTTPS`.
4. Faça push para `main` ou `master`.
5. A Action `Build and publish site` vai executar `make validate`, gerar `dist/`,
   enviar esse diretório como artefato e publicar o conteúdo no GitHub Pages.

O diretório `dist/` não deve ser versionado. Ele é recriado localmente por
`make build` e no GitHub Actions por `make validate`.

### Arquivo de workflow

O workflow usado para publicação é `.github/workflows/build-site.yml`.

Ele precisa das permissões abaixo para publicar no Pages:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

O deploy usa estas Actions oficiais:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

## SEO e indexação

O build executa `scripts/seo.mjs` depois de gerar conteúdo, FAQ e navegação.
Padroniza idioma e metadados, completa entidades de página/site/organização e
gera o sitemap com as URLs canônicas indexáveis e imagens. Datas `lastmod` só
são emitidas para artigos com data editorial conhecida; não use a data do build
como se fosse atualização de conteúdo.

`scripts/validate-seo.mjs`, integrado ao `make validate`, verifica todas as
páginas, títulos/descrições únicos, dimensões e alternativas das imagens,
canonicals, dados estruturados, sitemap e descoberta por links HTML a partir
da home. O catálogo completo de artigos fica disponível sem JavaScript.

URLs antigas continuam com redirecionamento HTML imediato, canonical de destino
e link navegável, compatíveis com GitHub Pages. A versão histórica dos termos
continua acessível com `noindex,follow`; os termos atuais permanecem indexáveis.

A auditoria de outubro de 2026, incluindo a configuração pendente na hospedagem
e acompanhamento no Search Console, está em
[docs/seo-revisao-2026-10.md](docs/seo-revisao-2026-10.md).
