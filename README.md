# sistemalaser-site
Site do Sistema Laser

## Estrutura do build

O arquivo `blog/posts.json` é a fonte de verdade das postagens. Cada entrada tem
metadados de SEO, categoria, tags, chamada, tempo de leitura e o HTML do corpo do
artigo em `contentHtml`.

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
  assets/
  robots.txt
  sitemap.xml
  llms.txt
```

O arquivo `CNAME` fica versionado na raiz como fonte e é copiado para `dist/`,
como o GitHub Pages espera para manter o domínio personalizado.

## Comandos

```sh
make build
```

Gera as páginas HTML do blog, o feed RSS e atualiza o sitemap.

```sh
make validate
```

Executa o build e valida páginas geradas, Schema.org, links internos e scripts
Node.

## GitHub Pages

O site continua estático e compatível com GitHub Pages. O workflow
`.github/workflows/build-site.yml` roda `make validate`, envia `dist/` como
artefato do Pages e publica esse diretório.

### Configuração no GitHub

No repositório, configure o Pages para publicar via GitHub Actions:

1. Acesse `Settings` > `Pages`.
2. Em `Build and deployment`, selecione `Source: GitHub Actions`.
3. Mantenha o arquivo `CNAME` na raiz do projeto com o domínio
   `sistemalaser.com.br`.
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
