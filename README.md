# Linksharing API (Node.js + Fastify + Prisma)

API para gerenciamento de perfis e páginas no estilo “Linktree”, construída em Node.js com TypeScript, Fastify e Prisma (PostgreSQL). O projeto segue uma estrutura orientada a casos de uso (use cases), com camadas de domínio e repositórios.

## Stack

- Node.js + TypeScript
- Fastify (HTTP) + @fastify/jwt + @fastify/cors
- Prisma ORM (PostgreSQL)
- Zod (validação)
- Vitest (unit e e2e)

## Requisitos

- Node.js 18+
- npm ou pnpm
- Docker (opcional, para subir o PostgreSQL via docker-compose)

## Comece rápido

1) Instale as dependências

```bash
npm install
```

2) Configure o banco (opções)

- Via Docker (recomendado para desenvolvimento):

```bash
docker compose up -d
```

O serviço cria um PostgreSQL local com as credenciais definidas em `docker-compose.yml`.

- Ou use sua instância PostgreSQL e ajuste o .env conforme necessário.

3) Crie um arquivo `.env` na raiz do projeto

```bash
# App
NODE_ENV=dev
PORT=3333
SECRET_KEY=uma_chave_segura_qualquer

# Prisma/Postgres
DATABASE_URL="postgresql://linktree-api:linktree@localhost:5432/linktree?schema=public"
# Em ambientes com conexão sem pool (útil para CI ou migrações pontuais):
DATABASE_URL_UNPOOLED="postgresql://linktree-api:linktree@localhost:5432/linktree?schema=public"
```

4) Aplique as migrações do Prisma

```bash
npx prisma migrate dev
```

**Importante:** Se você já tem dados no banco com o schema antigo, os campos `color` (de Background) e campos como `color`, `textColor`, etc. (de Button) foram removidos em favor de campos JSON. Considere criar uma migration de dados se necessário.

5) Rode em desenvolvimento

```bash
npm run start:dev
```

Aplicação por padrão inicia em `http://localhost:3333`.

## Scripts NPM

- `start:dev`: sobe o servidor com tsx em modo watch
- `build`: compila TypeScript para `build/`
- `start`: inicia a versão compilada (`node build/server.js`)
- `tests`: roda testes unitários (use-cases)
- `test:watch`: roda testes unitários em watch
- `pretest:e2e`: prepara o ambiente de testes E2E (link do vitest environment prisma)
- `test:e2e`: roda testes E2E (controllers/http)
- `test:e2e:watch`: E2E em watch
- `test:coverage`: cobertura de testes

## Variáveis de ambiente

Gerenciadas via Zod em `src/env/index.ts` e consumidas também pelo Prisma:

- `NODE_ENV` (dev | test | prod) – default: dev
- `PORT` – default: 3333
- `SECRET_KEY` – chave para assinar JWT
- `DATABASE_URL` – URL do Postgres para Prisma
- `DATABASE_URL_UNPOOLED` – alternativa sem pool (opcional)

## Banco de dados

O schema Prisma está em `prisma/schema.prisma` com os modelos:

- `User` (users) - Usuários do sistema
- `Page` (pages) - Páginas estilo Linktree
- `Theme` (themes) - Temas de aparência com suporte a presets (JSON fields para configurações avançadas)
- `Background` (backgrounds) - Fundos (cor, gradiente, imagem, vídeo) com propriedades CSS em JSON
- `Button` (buttons) - Estilos de botões com propriedades CSS em JSON
- `Link` (links) - Links exibidos nas páginas

**Nota sobre JSON fields:** Os modelos `Theme`, `Background` e `Button` utilizam campos JSON para armazenar configurações complexas de aparência (CSS properties, sub-estilos, etc.), compatíveis com o frontend React.

📖 **Documentação detalhada:** Veja [`docs/SCHEMA_FRONTEND_MAPPING.md`](docs/SCHEMA_FRONTEND_MAPPING.md) para entender o mapeamento completo entre o schema Prisma e os tipos TypeScript do frontend, incluindo exemplos de uso dos presets.

Use `npx prisma studio` para visualizar dados localmente.

## Endpoints (HTTP)

A aplicação registra por padrão as rotas de usuários. Há também rotas de páginas prontas no código (controllers e rotas), mas a importação dessas rotas pode precisar ser registrada em `src/app.ts` (veja “Notas” no final).

### Autenticação e usuários

- POST `/users` – Cadastro
	- body: `{ username: string, email: string, password: string(min 6) }`
	- 201 Created | 409 se usuário já existe

- POST `/me` – Autenticação (login)
	- body: `{ username: string, password: string(min 6) }`
	- 200 OK: `{ token: string }`

- GET `/users/search` – Busca por email e/ou username
	- query: `?email=...&username=...`
	- 200 OK: `{ user: { ... , password_hash: undefined } }`

Autorização:

- Endpoints protegidos usam JWT no header: `Authorization: Bearer <token>`

### Páginas (disponíveis no código)

As rotas abaixo estão implementadas em `src/http/controllers/pages` e definidas em `routes.ts`. Registre-as no app para habilitar (ver Nota 1).

- GET `/p/:slug` – Público, retorna detalhes da página
- POST `/pages` – Criação de página (JWT)
	- body: `{ slug, title?, description?, profilePictureUrl? }`
	- validações de slug e campos via Zod
- POST `/pages/:pageId/links` – Adiciona link a uma página (JWT, precisa ser dono)
	- body: `{ url, title?, order, thumbnailUrl?, highlightEffect? }`
- PUT `/pages/:pageId/theme` – Cria/atualiza o tema da página (JWT, precisa ser dono)
  - body: `{ themeTitle, backgroundId?: uuid | null, buttonId?: uuid | null }`
- POST `/pages/:pageId/theme/preset` – Aplica um preset completo do frontend (JWT, precisa ser dono)
  - body: `{ title: string, preset: AppearanceTheme }`
  - Cria automaticamente os registros Background, Button e Theme a partir do preset

Erros comuns: `400` (validação), `401` (sem token), `403` (não é dono), `404` (não encontrado).## Estrutura do projeto (resumo)

```
src/
	app.ts               # instancia Fastify, CORS, JWT e registra rotas
	server.ts            # boot do servidor
	env/                 # validação de variáveis (.env) com Zod
	http/
		controllers/       # adaptação HTTP para os casos de uso
		middlewares/       # ex.: verify-jwt
	use-cases/           # regras de negócio (DDD/use case)
		factories/         # monta casos de uso com repositórios concretos
		errors/            # erros de domínio
	repositories/
		in-memory/         # para testes
		prisma/            # implementação com Prisma
	domain/enterprise/   # entidades do domínio
	lib/prisma.ts        # PrismaClient
```

## Testes

- Unitários (use-cases):

```bash
npm run tests
```

- E2E (controllers/http):

```bash
npm run pretest:e2e
npm run test:e2e
```

- Cobertura:

```bash
npm run test:coverage
```

## Build e execução

```bash
npm run build
npm start
```

## Notas

1) Rotas de páginas: existe `pagesRoutes` em `src/http/controllers/pages/routes.ts`. Para habilitar, registre no `app`:

```ts
// src/app.ts
import { pagesRoutes } from './http/controllers/pages/routes'
app.register(pagesRoutes)
```

2) `profile.controller.ts`: há um import incorreto de `{ undefined, z }` do Zod (não é usado). Caso deseje expor o endpoint de perfil autenticado, registre o controller e ajuste o import.

3) Segurança: defina `SECRET_KEY` segura em produção e armazene segredos fora do repositório.

## Licença

ISC
