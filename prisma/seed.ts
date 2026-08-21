import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Seeding database with Henrique Setup Raffle data (1.000 numbers - R$ 30,00)...");

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

  // Clean existing tickets, payments, and raffles
  await prisma.ticket.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.raffle.deleteMany({});

  // 2. Create Henrique Setup Raffle PC Gamer (1.000 Numbers, R$ 30,00)
  const drawDate = new Date();
  drawDate.setDate(drawDate.getDate() + 14);

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
      price: 30.0, // R$ 30,00 por bilhete
      totalNumbers: 1000, // 1.000 BILHETES NO TOTAL
      status: "ACTIVE",
      prizeName: "PC Gamer Custom Hardline Liquid Cooling RTX 4090",
      prizeSpecs: specs,
      drawDate: drawDate,
    },
  });

  console.log(`🎮 Raffle created: ${raffle.title} (ID: ${raffle.id}) - R$ 30,00`);

  // 3. Generate 1.000 Ticket records (1 to 1000)
  console.log("🎫 Generating 1,000 ticket slots (1 to 1000)...");
  const ticketsData = [];
  for (let i = 1; i <= 1000; i++) {
    // Simula alguns números como comprados (PAID) para demonstração (ex: 42, 88, 100, 333, 777)
    const isPaid = [42, 88, 100, 333, 777].includes(i);

    ticketsData.push({
      raffleId: raffle.id,
      number: i,
      status: isPaid ? "PAID" : "AVAILABLE",
      userId: isPaid ? demoUser.id : null,
      expiresAt: null,
    });
  }

  await prisma.ticket.createMany({
    data: ticketsData as any,
  });

  console.log("✅ Database successfully seeded with 1,000 numbers!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
