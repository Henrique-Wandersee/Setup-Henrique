# Setup Henrique

Projeto inspirado no universo de GTA: uma aplicação web para gestão e venda de rifas online de setups gamers.

O objetivo foi construir uma plataforma rápida, segura e fácil de usar, onde o usuário escolhe seus números e paga via PIX em poucos cliques.

## Demonstração

![Setup Henrique](./Setup%20Henrique.png)

## Funcionalidades

**Seleção de bilhetes**
Grade interativa com 1.000 números (R$ 30,00 cada), busca rápida, filtro por status (Disponíveis/Comprados) e carrinho dinâmico.

**Pagamento via PIX**
Integração com o Mercado Pago para geração automática de QR Code e chave copia-e-cola, com timer de reserva de 15 minutos.

**Autenticação e segurança**
Cadastro e login com NextAuth.js, validação de dados com Zod, senhas com hash via bcrypt e proteção contra tentativas de login incorretas.

**Persistência e estrutura**
Banco PostgreSQL com Prisma ORM. Reservas de número tratadas em transação, evitando que dois usuários reservem o mesmo número ao mesmo tempo.

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend / Banco | Node.js, Prisma ORM, PostgreSQL |
| Integrações | Mercado Pago API, Resend API |

## Como rodar

\`\`\`bash
git clone https://github.com/seu-usuario/setup-henrique.git
cd setup-henrique
npm install
\`\`\`

Configure as variáveis de ambiente (`.env`):

\`\`\`env
DATABASE_URL=
NEXTAUTH_SECRET=
MERCADOPAGO_ACCESS_TOKEN=
RESEND_API_KEY=
\`\`\`

Depois:

\`\`\`bash
npx prisma generate
npx prisma db push
npm run dev
\`\`\`

Estrutura de pastas
```
setup/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── auth.ts
│   │   │   └── tickets.ts
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhooks/mercadopago/route.ts
│   │   │   └── tickets/reserve/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroQuantumStorm.tsx
│   │   ├── RaffleGrid.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── Leaderboard.tsx
│   │   └── AuthModal.tsx
│   └── lib/
│       ├── auth.ts
│       ├── mercadopago.ts
│       ├── prisma.ts
│       └── resend.ts
├── .env
├── package.json
└── tailwind.config.ts
```
