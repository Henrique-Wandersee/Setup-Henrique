import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Seeding database with Henrique Setup Raffle data (100 numbers)...");

  // 1. Create Demo User
  const hashedPassword = await bcrypt.hash("Henrique123!", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "henrique@setup.io" },
    update: {},
    create: {
      name: "Henrique",
      email: "henrique@setup.io",
      passwordHash: hashedPassword,
      emailVerified: new Date(),
      role: "ADMIN",
      xp: 5000,
      level: 10,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`👤 User created: ${demoUser.name} (${demoUser.email})`);

  // Clean existing tickets and raffles for fresh 100-ticket setup
  await prisma.ticket.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.raffle.deleteMany({});

  // 2. Create Henrique Setup Raffle PC Gamer
  const drawDate = new Date();
  drawDate.setDate(drawDate.getDate() + 14); // 14 days draw date

  const specs = JSON.stringify([
    { label: "PLACA DE VÍDEO", spec: "NVIDIA GeForce RTX 4090 24GB GDDR6X", level: 100 },
    { label: "PROCESSADOR", spec: "Intel Core i9-14900KS 6.2GHz Unlocked", level: 100 },
    { label: "MEMÓRIA RAM", spec: "64GB DDR5 Corsair Dominator 7200MHz RGB", level: 95 },
    { label: "WATER COOLER", spec: "Custom Hardline Liquid Cooling Dual Loop Barrow + Lian Li", level: 100 },
    { label: "ARMAZENAMENTO", spec: "4TB NVMe M.2 PCIe 5.0 SSD (12,000 MB/s)", level: 95 },
    { label: "GABINETE", spec: "Lian Li O11 Dynamic EVO RGB Custom Edition", level: 100 },
  ]);

  const raffle = await prisma.raffle.create({
    data: {
      title: "HENRIQUE SETUP - ULTIMATE RIG ENTHUSIAST",
      description: "Setup exclusivo montado sob medida com Water Cooler Custom rígido Barrow, iluminação RGB sincronizada, RTX 4090 e processador i9-14900KS.",
      price: 15.0, // R$ 15,00 por número
      totalNumbers: 100, // APENAS 100 NÚMEROS
      status: "ACTIVE",
      prizeName: "PC Gamer Custom Hardline Liquid Cooling RTX 4090",
      prizeSpecs: specs,
      drawDate: drawDate,
    },
  });

  console.log(`🎮 Raffle created: ${raffle.title} (ID: ${raffle.id})`);

  // 3. Generate 100 Ticket records (1 to 100)
  console.log("🎫 Generating 100 ticket slots (1 to 100)...");
  const ticketsData = [];
  for (let i = 1; i <= 100; i++) {
    ticketsData.push({
      raffleId: raffle.id,
      number: i,
      status: "AVAILABLE", // Todos disponíveis para início das vendas!
      userId: null,
      expiresAt: null,
    });
  }

  await prisma.ticket.createMany({
    data: ticketsData as any,
  });

  console.log("✅ Database successfully seeded with 100 numbers!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
