import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Seeding database with Futuristic PC Gamer Raffle data...");

  // 1. Create Demo User (NEXUS_RIDER)
  const hashedPassword = await bcrypt.hash("cyber123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "nexus_rider@cybernet.io" },
    update: {},
    create: {
      name: "NEXUS_RIDER",
      email: "nexus_rider@cybernet.io",
      password: hashedPassword,
      role: "USER",
      xp: 14250,
      level: 28,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`👤 User created: ${demoUser.name} (${demoUser.email})`);

  // 2. Create Quantum Storm Raffle
  const drawDate = new Date();
  drawDate.setDate(drawDate.getDate() + 7); // 7 days from now

  const specs = JSON.stringify([
    { label: "GRAPHICS", spec: "NVIDIA GeForce RTX 4090 24GB GDDR6X", level: 100 },
    { label: "CPU", spec: "Intel Core i9-14900KS 6.2GHz Unlocked", level: 95 },
    { label: "RAM", spec: "64GB DDR5 Corsar Dominator Titanium 7200MHz", level: 90 },
    { label: "COOLING", spec: "Custom Hardline Liquid Loop with Quantum Digital OLED Block", level: 100 },
    { label: "STORAGE", spec: "4TB NVMe M.2 Gen5 SSD (12,000 MB/s)", level: 95 },
    { label: "CHASSIS", spec: "Lian Li O11 Dynamic EVO Cyberpunk Limited Edition", level: 100 },
  ]);

  const raffle = await prisma.raffle.create({
    data: {
      title: "THE QUANTUM STORM - ULTIMATE RIG",
      description: "Setup dos sonhos de alta performance com refrigeração líquida customizada, iluminação neon sincronizada e componentes topo de linha.",
      price: 15.0, // R$ 15,00 por número
      totalNumbers: 1000,
      status: "ACTIVE",
      prizeName: "Quantum Storm Enthusiast PC Gamer + Monitor OLED 240Hz",
      prizeSpecs: specs,
      drawDate: drawDate,
    },
  });

  console.log(`🎮 Raffle created: ${raffle.title} (ID: ${raffle.id})`);

  // 3. Generate 1000 Ticket records
  console.log("🎫 Generating 1,000 ticket slots...");
  const ticketsData = [];
  for (let i = 1; i <= 1000; i++) {
    // Mark some numbers as SOLD / PAID for realistic simulation (e.g., #42, #88, #100, #333, #777)
    const isSold = [42, 88, 100, 333, 500, 777, 888, 999].includes(i);
    const isReserved = [15, 27, 212, 350].includes(i);

    ticketsData.push({
      raffleId: raffle.id,
      number: i,
      status: isSold ? "PAID" : isReserved ? "RESERVED" : "AVAILABLE",
      userId: isSold || isReserved ? demoUser.id : null,
      expiresAt: isReserved ? new Date(Date.now() + 15 * 60 * 1000) : null,
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
