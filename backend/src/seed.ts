import {
  PrismaClient,
  Role,
  TicketStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@eventos.com",
      password: "hashedpassword", // usar hash real en producción
      isActive: true,
      role: Role.ADMIN,
    },
  });

  // Crear categorías
  const musicCategory = await prisma.category.create({
    data: { name: "Música" },
  });
  const techCategory = await prisma.category.create({
    data: { name: "Tecnología" },
  });

  // Crear eventos
  const event1 = await prisma.event.create({
    data: {
      title: "Concierto Rock",
      description: "Una noche llena de rock",
      location: "Estadio Ciudad",
      date: new Date("2025-08-15T20:00:00Z"),
      capacity: 500,
      price: 2500,
      promo: true,
      soldOut: false,
      categoryId: musicCategory.id,
      organizerId: admin.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Conferencia JS",
      description: "Charlas técnicas sobre JavaScript moderno",
      location: "Centro de Convenciones",
      date: new Date("2025-09-10T10:00:00Z"),
      capacity: 300,
      price: 1500,
      promo: false,
      soldOut: false,
      categoryId: techCategory.id,
      organizerId: admin.id,
    },
  });

  // Crear tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      eventId: event1.id,
      buyerName: "Juan",
      buyerLastName: "Pérez",
      buyerEmail: "juan@example.com",
      buyerPhone: "123456789",
      buyerDni: "12345678",
      status: TicketStatus.PAID,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      eventId: event2.id,
      buyerName: "Lucía",
      buyerLastName: "Gómez",
      buyerEmail: "lucia@example.com",
      buyerPhone: "987654321",
      buyerDni: "87654321",
      status: TicketStatus.PENDING,
    },
  });

  // Crear cupón
  await prisma.coupon.create({
    data: {
      code: "PROMO10",
      discount: 10,
      isPercentage: true,
      eventId: event1.id,
      expiresAt: new Date("2025-12-31"),
      maxUses: 100,
    },
  });

  // Crear orden para Juan
  const order1 = await prisma.order.create({
    data: {
      userId: admin.id,
      totalPrice: 2500,
      status: OrderStatus.PAID,
      tickets: {
        connect: [{ id: ticket1.id }],
      },
    },
  });

  // Crear pago asociado
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 2500,
      method: "mercado_pago",
      status: PaymentStatus.COMPLETED,
    },
  });

  // Notificación para admin
  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: "Bienvenido al panel",
      message: "Gracias por usar nuestra plataforma de eventos.",
      read: false,
    },
  });

  console.log("✅ Seed completado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error al hacer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
