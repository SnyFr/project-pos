import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("Memulai seeding database POS Cafe...");

  // 1. Hash password default untuk semua akun uji coba
  const hashedPassword = await bcrypt.hash("12345678", 10);

  // 2. Buat 3 User dengan Role berbeda (upsert agar aman dijalankan berulang kali)
  const admin = await prisma.user.upsert({
    where: { email: "admin@cafepos.com" },
    update: {},
    create: {
      name: "Admin 1",
      email: "admin@cafepos.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: "kasir@cafepos.com" },
    update: {},
    create: {
      name: "Kasir 1",
      email: "kasir@cafepos.com",
      password: hashedPassword,
      role: "CASHIER",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "agil@cafepos.com" },
    update: {},
    create: {
      name: "Agil",
      email: "agil@cafepos.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  // 3. Buat Meja Cafe (CafeTable)
  const tablesData = [
    { tableNumber: "MEJA-01", qrSlug: "meja-01", capacity: 2 },
    { tableNumber: "MEJA-02", qrSlug: "meja-02", capacity: 4 },
    { tableNumber: "MEJA-03", qrSlug: "meja-03", capacity: 4 },
    { tableNumber: "OUTDOOR-01", qrSlug: "outdoor-01", capacity: 6 },
  ];

  for (const table of tablesData) {
    await prisma.cafeTable.upsert({
      where: { tableNumber: table.tableNumber },
      update: {},
      create: table,
    });
  }

  // 4. Buat Kategori Menu
  const coffeeCategory = await prisma.category.upsert({
    where: { name: "Coffee" },
    update: {},
    create: {
      name: "Coffee",
      description: "Aneka minuman espresso base dan manual brew",
    },
  });

  const nonCoffeeCategory = await prisma.category.upsert({
    where: { name: "Non-Coffee" },
    update: {},
    create: {
      name: "Non-Coffee",
      description: "Matcha, cokelat, dan minuman segar tanpa kafein kopi",
    },
  });

  const pastryCategory = await prisma.category.upsert({
    where: { name: "Pastry & Snack" },
    update: {},
    create: {
      name: "Pastry & Snack",
      description: "Pendamping kopi hangat dan camilan ringan",
    },
  });

  // 5. Buat Produk Menu Awal
  const productsData = [
    {
      sku: "COF-001",
      name: "Kopi Susu Gula Aren",
      description: "Espresso house blend dengan susu segar dan gula aren organik",
      price: 22000,
      stock: 50,
      categoryId: coffeeCategory.id,
    },
    {
      sku: "COF-002",
      name: "Iced Americano",
      description: "Double shot espresso dengan air dingin menyegarkan",
      price: 18000,
      stock: 50,
      categoryId: coffeeCategory.id,
    },
    {
      sku: "NCF-001",
      name: "Matcha Latte",
      description: "Pure Uji matcha dengan steamed fresh milk",
      price: 25000,
      stock: 30,
      categoryId: nonCoffeeCategory.id,
    },
    {
      sku: "PST-001",
      name: "Butter Croissant",
      description: "Croissant renyah berlapis mentega Prancis",
      price: 20000,
      stock: 15,
      categoryId: pastryCategory.id,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log("Seeding selesai!", { admin: admin.email, cashier: cashier.email, customer: customer.email });
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });