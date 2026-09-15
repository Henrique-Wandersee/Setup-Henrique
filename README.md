Setup Henrique

O que já está implementado <br>
Banco de dados (`prisma/schema.prisma`) <br>
`User`: cadastro, role (USER/ADMIN), senha com hash bcrypt, XP/nível<br>
`Raffle`: dados da rifa (título, descrição, preço, total de números, specs em JSON)<br>
`Ticket`: números vinculados ao usuário, status (`AVAILABLE`, `RESERVED`, `PAID`) e `expiresAt`<br>
`Payment`: transações do Mercado Pago (PIX copia-e-cola + QR code)<br>
`PasswordResetToken`: tokens de reset com expiração de 1h<br>
Reserva de números (`src/app/actions/tickets.ts`)<br>
Server Action dentro de `prisma.$transaction` para evitar race condition na reserva. Marca os números como `RESERVED` com expiração de 15 minutos e gera a cobrança PIX no Mercado Pago.<br>
Webhook de pagamento (`src/app/api/webhooks/mercadopago/route.ts`)<br>
Recebe as notificações do Mercado Pago, valida a assinatura (`x-signature`, HMAC SHA-256) e, dentro de uma transação, atualiza o `Payment` para `APPROVED`, converte os `Ticket`s de `RESERVED` para `PAID` e credita XP/nível ao usuário.<br>
Auth e recuperação de senha (`src/lib/auth.ts`, `src/app/actions/auth.ts`)<br>
Login por credenciais com `bcrypt.compare` e sessão via JWT. `requestPasswordResetAction` gera um token com `crypto.randomBytes(32)` e dispara e-mail pelo Resend.<br>
<br>

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
