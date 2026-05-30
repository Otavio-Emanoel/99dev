# 99dev API

Estrutura base do backend em Fastify + TypeScript, organizada para crescer por módulos.

## Estrutura

- `src/server.ts` inicia o servidor.
- `src/app.ts` monta a aplicação Fastify.
- `src/config/env.ts` centraliza configurações de ambiente.
- `src/routes/` agrupa as rotas da aplicação.

## Endpoints atuais

- `GET /health`
- `GET /`

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```