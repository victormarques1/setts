# Arquitetura

Frontend:

- Next.js
- React
- TypeScript
- Tailwind
- Shadcn

Backend:

- Server Actions

Banco:

- PostgreSQL
- Prisma

# Organização

Estrutura baseada em módulos.

Cada módulo deve possuir:

- actions
- services
- repositories
- validations
- components

Exemplo:

modules/workouts
modules/exercises
modules/sessions
modules/progress

## Fluxo

UI
↓
Server Action
↓
Service
↓
Repository
↓
Prisma
↓
Banco
