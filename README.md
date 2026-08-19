# ⚡ ELITE GAMER SETUPS RAFFLE - THE QUANTUM STORM

Uma plataforma web futurista e de alta performance desenvolvida para sorteio de um PC Gamer Enthusiast ("THE QUANTUM STORM"). Construída com Next.js (App Router), TypeScript, Prisma ORM, NextAuth.js e integração via Mercado Pago PIX Webhooks.

---

## 🛠️ Stack Tecnológica & Arquitetura

- **Frontend / Backend**: Next.js 14 (App Router) + React Server Components.
- **Estilização**: Tailwind CSS com tema Cyberpunk / Neon personalizável.
- **Banco de Dados**: SQLite (Desenvolvimento local imediato) / PostgreSQL (Produção).
- **ORM**: Prisma.
- **Autenticação**: NextAuth.js com Credenciais (Bcrypt Hash) e Fluxo de Recuperação de Senha (Resend).
- **Pagamentos**: Mercado Pago SDK (Foco em PIX) + Validação HMAC em Webhook.
- **E-mails**: Resend API.

---

## 📋 Resumo das Etapas Finais Desenvolvidas

### 🔷 Etapa 1: Modelagem do Banco de Dados (`prisma/schema.prisma`)
O esquema contém todas as entidades com constraints e índices otimizados:
- `User`: Cadastro, role (USER/ADMIN), hash de senha (Bcrypt), XP e Nível para gamificação.
- `Raffle`: Rifa ativa do PC Gamer (título, descrição, preço, total de números, specs em JSON).
- `Ticket`: Números da rifa vinculados ao usuário e status (`AVAILABLE`, `RESERVED`, `PAID`) com tempo de expiração (`expiresAt`).
- `Payment`: Registro de transações vinculadas ao Mercado Pago (PIX Copy/Paste e QR Code Base64).
- `PasswordResetToken`: Tokens criptográficos seguros com 1 hora de expiração para redefinição de senha.

### ⚡ Etapa 2: Lógica de Reserva e Concorrência (`src/app/actions/tickets.ts`)
- Server Action rodando atomicamente em um bloco `prisma.$transaction`.
- Verifica se os números solicitados estão livres de condições de corrida (*Race Conditions*).
- Atualiza os números para `RESERVED` definindo expiração de 15 minutos (`Date.now() + 15 * 60 * 1000`).
- Gera o payload de cobrança PIX no Mercado Pago e vincula ao pagamento.

### 💳 Etapa 3: Integração de Pagamento & Webhook (`src/app/api/webhooks/mercadopago/route.ts`)
- Rota de Webhook configurada para notificações automáticas do Mercado Pago.
- Validação HMAC SHA-256 do cabeçalho `x-signature` (`verifyMercadoPagoSignature`).
- Transação no Prisma para atualizar `Payment` para `APPROVED`, converter os `Ticket`s de `RESERVED` para `PAID` e conceder XP/Level ao usuário de forma transparente.

### 🔐 Etapa 4: Autenticação e Recuperação de Senha (`src/lib/auth.ts` e `src/app/actions/auth.ts`)
- Provedor de Credenciais com `bcrypt.compare` e controle de sessão via JWT.
- Ação `requestPasswordResetAction` que gera um token aleatório via `crypto.randomBytes(32)` e envia e-mail com template cibernético via Resend (`src/lib/resend.ts`).

---

## 🚀 Como Executar o Projeto no VS Code

### 1. Instalar as dependências:
```bash
npm install
```

### 2. Gerar Cliente Prisma e Popular o Banco com 1.000 Números:
```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

### 3. Rodar em Modo de Desenvolvimento:
```bash
npm run dev
```

Acesse em seu navegador: **`http://localhost:3000`**

---

## 📁 Estrutura de Arquivos

```
setup/
├── prisma/
│   ├── schema.prisma              # Modelagem do Banco (Etapa 1)
│   └── seed.ts                    # Script de popular 1.000 números & PC Gamer
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── auth.ts            # Actions de Auth & Esqueci a Senha (Etapa 4)
│   │   │   └── tickets.ts         # Action de Reserva com Transação (Etapa 2)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhooks/mercadopago/route.ts # Webhook Mercado Pago (Etapa 3)
│   │   │   └── tickets/reserve/route.ts
│   │   ├── globals.css            # Estilos Cyber Neon
│   │   ├── layout.tsx
│   │   └── page.tsx               # Hub Principal Quantum Storm
│   ├── components/
│   │   ├── Header.tsx             # Navegação e Perfil Gamer
│   │   ├── HeroQuantumStorm.tsx   # 3D Setup PC Gamer & Specs
│   │   ├── RaffleGrid.tsx         # Grid Hexagonal (Livre/Selecionado/Vendido)
│   │   ├── CheckoutModal.tsx      # Modal PIX Holográfico com Varredura Laser
│   │   ├── Leaderboard.tsx        # Ranking Champions League Arcade
│   │   └── AuthModal.tsx          # Login, Registro & Redefinição
│   └── lib/
│       ├── auth.ts                # NextAuth Options (Etapa 4)
│       ├── mercadopago.ts         # Gateway PIX & Assinatura (Etapa 3)
│       ├── prisma.ts              # Instância Singleton do Prisma
│       └── resend.ts              # Envio de E-mails com Resend (Etapa 4)
├── .env                           # Variáveis de Ambiente
├── package.json
└── tailwind.config.ts             # Cores e Animações Futuristas
```
