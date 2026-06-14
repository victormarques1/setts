# setts

Aplicação web para registro de progressão de carga na academia. Permite criar treinos, registrar séries com peso e repetições, acompanhar o histórico de sessões e visualizar a evolução por exercício.

Desenvolvida para uso mobile-first, pensada para ser em academias, com navegação inferior, barras de ação fixas e áreas de toque confortáveis.

## Problema que resolve

Praticantes de musculação frequentemente registram cargas em papel, notas ou planilhas, ou deixam de registrar por completo. Isso dificulta acompanhar a progressão e tomar decisões sobre quando aumentar carga ou volume.

O **setts** centraliza esse registro em um fluxo simples: treino → sessão → séries → histórico e progressão.

## Funcionalidades

### Treinos

- Criar, editar e excluir treinos (soft delete)
- Listar treinos com contagem de exercícios e data da última sessão
- Acessar detalhes do treino com lista de exercícios

### Exercícios

- Adicionar exercícios a um treino
- Editar e excluir exercícios
- Visualizar última carga registrada por exercício

### Sessões de treino

- Iniciar uma sessão a partir de um treino
- Registrar séries (número, peso em kg, repetições)
- Editar e excluir séries já registradas
- Continuar sessão em andamento
- Cancelar sessão ativa
- Finalizar sessão com barra de progresso (exercícios e séries concluídas)

### Histórico

- Listar treinos finalizados com data e hora
- Revisar detalhes de sessões concluídas (exercícios e séries)

### Progressão

- Buscar exercícios por nome
- Filtrar por treino
- Ver última carga, recorde pessoal e tendência (alta, estável, queda)
- Gráfico de evolução de carga ao longo do tempo
- Linha do tempo com histórico de séries

### Autenticação

- Cadastro com nome, e-mail e senha
- Login com credenciais
- Sessão JWT via NextAuth
- Rotas protegidas por middleware

## Stack tecnológica

| Camada         | Tecnologia                                                   |
| -------------- | ------------------------------------------------------------ |
| Framework      | [Next.js 16](https://nextjs.org) (App Router)                |
| Linguagem      | TypeScript                                                   |
| UI             | React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) |
| Banco de dados | PostgreSQL 16                                                |
| ORM            | [Prisma 7](https://www.prisma.io)                            |
| Autenticação   | [NextAuth.js v5](https://authjs.dev) (Credentials + JWT)     |
| Validação      | [Zod](https://zod.dev)                                       |
| Gráficos       | [Recharts](https://recharts.org)                             |
| Ícones         | [Lucide React](https://lucide.dev)                           |

## Arquitetura

O projeto segue uma arquitetura em camadas por domínio, com separação clara de responsabilidades:

```
modules/
  <domínio>/
    actions/        → Server Actions (entrada da aplicação)
    services/       → Regras de negócio
    repositories/   → Acesso ao banco (Prisma)
    validations/    → Schemas Zod
    components/     → Componentes React do domínio
```

### Fluxo de dados

```
Componente → Server Action → Service → Repository → Prisma → PostgreSQL
```

- **Server Actions** são preferidas em vez de rotas API REST
- **Services** concentram regras de negócio e validações de domínio
- **Repositories** encapsulam queries Prisma
- **Components** permanecem pequenos e sem lógica de negócio
- Entradas são validadas com **Zod** antes de chegar ao service

### Padrão de resposta das actions

Todas as Server Actions retornam um `ActionResult<T>`:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

## Estrutura do projeto

```
setts/
├── app/                          # App Router (Next.js)
│   ├── (app)/                    # Rotas autenticadas (layout com navbar)
│   │   ├── workouts/             # Treinos e sessões
│   │   ├── history/              # Histórico de sessões
│   │   └── progress/             # Progressão por exercício
│   ├── login/                    # Login
│   ├── register/                 # Cadastro
│   └── api/auth/                 # Handler NextAuth
├── components/
│   ├── layout/                   # Navbar, logo, chrome da app
│   ├── ui/                       # Componentes base (shadcn)
│   ├── actions/                  # Botões reutilizáveis (editar, excluir)
│   └── feedback/                 # Feedback de erro
├── lib/                          # Utilitários compartilhados
├── modules/                      # Domínios da aplicação
│   ├── auth/
│   ├── workouts/
│   ├── exercises/
│   ├── sessions/
│   └── progress/
├── prisma/
│   ├── schema.prisma             # Fonte da verdade do banco
│   └── migrations/
└── docs/                         # Documentação complementar
```

## Rotas principais

| Rota                                                                | Descrição                        |
| ------------------------------------------------------------------- | -------------------------------- |
| `/`                                                                 | Landing page (pública)           |
| `/login`                                                            | Login                            |
| `/register`                                                         | Cadastro                         |
| `/workouts`                                                         | Lista de treinos                 |
| `/workouts/new`                                                     | Criar treino                     |
| `/workouts/[workoutId]`                                             | Detalhes do treino e exercícios  |
| `/workouts/[workoutId]/exercises/new`                               | Adicionar exercício              |
| `/workouts/[workoutId]/sessions/[sessionId]`                        | Sessão em andamento ou concluída |
| `/workouts/[workoutId]/sessions/[sessionId]/exercises/[exerciseId]` | Registrar séries de um exercício |
| `/history`                                                          | Histórico de treinos finalizados |
| `/progress`                                                         | Progressão por exercício         |

## Modelo de dados

```
User
 └── Workout (soft delete via deletedAt)
      ├── Exercise
      └── WorkoutSession (ACTIVE | COMPLETED | CANCELED)
           └── SetRecord (setNumber, weight, reps)
```

### Entidades

| Modelo           | Campos principais                                  |
| ---------------- | -------------------------------------------------- |
| `User`           | id, name, email, passwordHash                      |
| `Workout`        | id, userId, name, deletedAt                        |
| `Exercise`       | id, workoutId, name, createdAt                     |
| `WorkoutSession` | id, workoutId, status, performedAt, canceledAt     |
| `SetRecord`      | id, sessionId, exerciseId, setNumber, weight, reps |

Cada combinação `(sessionId, exerciseId, setNumber)` é única, uma série por número dentro de uma sessão.

O client Prisma é gerado em `app/generated/prisma`.

## Pré-requisitos

- **Node.js** >= 20.19.0
- **Docker** e **Docker Compose** (para o PostgreSQL local)
- **npm** (ou compatível)

## Configuração local

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd setts
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

Variáveis necessárias:

| Variável            | Descrição             | Exemplo                                         |
| ------------------- | --------------------- | ----------------------------------------------- |
| `POSTGRES_USER`     | Usuário do PostgreSQL | `setts`                                         |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL   | `setts`                                         |
| `POSTGRES_DB`       | Nome do banco         | `setts`                                         |
| `POSTGRES_HOST`     | Host do PostgreSQL    | `localhost`                                     |
| `POSTGRES_PORT`     | Porta exposta         | `5432`                                          |
| `DATABASE_URL`      | URL de conexão Prisma | `postgresql://setts:setts@localhost:5432/setts` |
| `AUTH_SECRET`       | Segredo do NextAuth   | Gere com `openssl rand -base64 32`              |

### 3. Subir o banco e aplicar migrations

Opção completa (Docker + migrations):

```bash
npm run db:setup
```

Ou passo a passo:

```bash
npm run db:up          # Sobe o PostgreSQL via Docker
npm run db:migrate     # Aplica migrations
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Script                      | Descrição                              |
| --------------------------- | -------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento            |
| `npm run build`             | Gera client Prisma e build de produção |
| `npm run start`             | Servidor de produção                   |
| `npm run lint`              | ESLint                                 |
| `npm run db:up`             | Sobe PostgreSQL (Docker Compose)       |
| `npm run db:down`           | Para PostgreSQL                        |
| `npm run db:setup`          | Sobe banco + aplica migrations         |
| `npm run db:migrate`        | Cria/aplica migrations (dev)           |
| `npm run db:migrate:deploy` | Aplica migrations (produção)           |
| `npm run db:push`           | Sincroniza schema sem migration        |
| `npm run db:generate`       | Gera client Prisma                     |
| `npm run db:studio`         | Abre Prisma Studio na porta 5555       |

## Fluxo de uso

```mermaid
flowchart TD
    A[Criar conta / Login] --> B[Lista de treinos]
    B --> C[Criar treino]
    C --> D[Adicionar exercícios]
    D --> E[Iniciar sessão]
    E --> F[Registrar séries por exercício]
    F --> G{Mais exercícios?}
    G -->|Sim| F
    G -->|Não| H[Finalizar treino]
    H --> I[Histórico]
    H --> J[Progressão]
```

1. **Cadastre-se** ou faça login
2. **Crie um treino** (ex.: "Peito e tríceps")
3. **Adicione exercícios** ao treino (ex.: Supino reto, Crucifixo)
4. **Inicie uma sessão** na tela do treino
5. **Registre séries** de cada exercício (peso e repetições)
6. **Finalize o treino** quando concluir
7. **Consulte o histórico** ou a **progressão** para acompanhar a evolução

## Documentação complementar

- [`docs/product.md`](docs/product.md), visão de produto e escopo
- [`docs/database.md`](docs/database.md), resumo das entidades
