
O que já está implementado
Banco de dados (`prisma/schema.prisma`)
`User`: cadastro, role (USER/ADMIN), senha com hash bcrypt, XP/nível
`Raffle`: dados da rifa (título, descrição, preço, total de números, specs em JSON)
`Ticket`: números vinculados ao usuário, status (`AVAILABLE`, `RESERVED`, `PAID`) e `expiresAt`
`Payment`: transações do Mercado Pago (PIX copia-e-cola + QR code)
`PasswordResetToken`: tokens de reset com expiração de 1h
Reserva de números (`src/app/actions/tickets.ts`)
Server Action dentro de `prisma.$transaction` para evitar race condition na reserva. Marca os números como `RESERVED` com expiração de 15 minutos e gera a cobrança PIX no Mercado Pago.
Webhook de pagamento (`src/app/api/webhooks/mercadopago/route.ts`)
Recebe as notificações do Mercado Pago, valida a assinatura (`x-signature`, HMAC SHA-256) e, dentro de uma transação, atualiza o `Payment` para `APPROVED`, converte os `Ticket`s de `RESERVED` para `PAID` e credita XP/nível ao usuário.
Auth e recuperação de senha (`src/lib/auth.ts`, `src/app/actions/auth.ts`)
Login por credenciais com `bcrypt.compare` e sessão via JWT. `requestPasswordResetAction` gera um token com `crypto.randomBytes(32)` e dispara e-mail pelo Resend.


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
