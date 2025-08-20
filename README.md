# Ask Me Anything • Next.js

![Ask Me Anything](./src/assets/ama-logo.svg)

> Crie salas públicas de AMA e priorize perguntas por votos em tempo real.

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/)

---

## Visão geral

Aplicação web para sessões de Ask Me Anything (AMA):

- Crie salas com um tema e compartilhe o link.
- Envie perguntas e curta as melhores para priorizá‑las.
- Acompanhe tudo em tempo real via WebSockets.
- Hosts podem marcar perguntas como respondidas e deletar a sala; autores podem deletar suas próprias mensagens.

> Dica: a UI é responsiva, com foco em simplicidade e legibilidade no modo escuro.

## Destaques

- Sala pública com link compartilhável e “Código da sala” visível
- Reações (upvotes) com ordenação por importância e status “respondida”
- Tempo real via WebSockets (subscribe por sala)
- Gestão de sessão por cookies (fetch com `credentials: 'include'`)
- Controle de host via token salvo no `localStorage`
- UX com toasts, popovers e switches (Radix + Sonner)

## Stack técnica

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Radix UI Primitives + lucide‑react + Sonner
- TanStack Query (cache, suspense, invalidation)
- WebSockets para eventos em tempo real

## Estrutura do projeto

```text
app/
	page.tsx                # Landing com CTA
	my-rooms/               # Salas do usuário
	room/
		create-room/          # Criar sala
		[roomId]/             # Sala com mensagens
src/
	components/             # Message, Messages, forms e UI
	hook/                   # Hooks (React Query + integrações)
	http/                   # Client de API (REST + cookies)
	lib/                    # Utils
	assets/                 # Logo e ícones
utils/                    # host-token (localStorage)
```

## Requisitos de ambiente

Crie um arquivo `.env.local` na raiz com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_WS_URL=ws://localhost:3333
```

Notas:

- A API deve expor endpoints REST compatíveis com os clientes em `src/http/*`.
- Sessão do usuário é mantida via cookie de sessão (as requisições usam `credentials: 'include'`).
- O token de host é salvo no `localStorage` por sala (chave `host-token-<roomId>`).

## Como executar

1. Instale as dependências (recomendado pnpm):

```bash
pnpm install
```

1. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

1. Acesse: <http://localhost:3000>

Build e produção:

```bash
pnpm build
pnpm start
```

## Rotas principais

- `/` Landing com CTA para criar sala e acessar “Minhas salas”
- `/my-rooms` Lista de salas do usuário logado + logout
- `/room/create-room` Formulário de criação de sala (salva host token)
- `/room/[roomId]` Tela da sala com perguntas, reações e status respondida

## Integração com a API

Chamadas principais (todas usam `NEXT_PUBLIC_API_URL`):

- `POST /rooms` criar sala → retorna `{ id, host_token }`
- `GET /rooms` listar salas
- `GET /rooms/:roomId` obter info da sala
- `GET /rooms/:roomId/messages` listar mensagens da sala
- `POST /rooms/:roomId/messages` criar mensagem
- `POST /rooms/:roomId/messages/:messageId/reactions` criar reação
- `DELETE /rooms/:roomId/messages/:messageId/reactions` remover reação
- `PATCH /rooms/:roomId/messages/:messageId/answered` marcar como respondida
- `DELETE /rooms/:roomId/messages/:messageId` deletar mensagem do autor
- `GET /rooms/:roomId/host-status` verificar status de host (usa header `X-Host-Token` quando disponível)

Tempo real (usa `NEXT_PUBLIC_WS_URL`):

- `WS /subscribe/:roomId` envia eventos: `message_created`, `message_answered`, `message_reaction_increased`, `message_reaction_decreased`, `message_deleted`, `room_deleted`.

## Experiência de uso

- Ordenação: não respondidas primeiro, depois respondidas; dentro de cada grupo, por número de reações.
- Compartilhamento: botão “Compartilhar” usa Web Share API quando disponível ou copia a URL.
- Toasters: feedbacks de sucesso/erro com Sonner.

## Desenvolvimento

- Lint: `pnpm lint`
- Estilos: Tailwind CSS 4 (@tailwindcss/postcss). Classes utilitárias na UI.
- Estado de dados: React Query com `useQuery`/`useSuspenseQuery` e invalidações por chave.

## Deploy

Pronto para Vercel (Next.js 15):

- Configure as variáveis `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_WS_URL` no projeto.
- Use `pnpm build` no build step e `pnpm start` para produção (ou o runtime padrão do Next/Vercel).

## Roadmap e ideias

- [ ] Página pública de listagem de salas
- [ ] Modo moderador com filtros/ordenação
- [ ] Tema claro/escuro alternável pelo usuário
- [ ] Indicadores de presença/atividades em tempo real
- [ ] Testes E2E (Playwright) e unitários

## Contribuição

Contribuições são bem‑vindas! Abra uma issue para discutir novas features ou bugs e envie um PR com uma descrição clara.

## Licença

Este repositório não define uma licença explícita. Adicione uma licença (por exemplo, MIT) conforme necessário para o seu uso.
