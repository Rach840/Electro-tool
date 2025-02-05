import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create users
  await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        username: "client",
        password: bcrypt.hashSync("password", 10),
        role: Role.CLIENT,
      },
      {
        name: "Jane Smith",
        username: "sales",
        password: bcrypt.hashSync("password", 10),
        role: Role.SALES_MANAGER,
      },
      {
        name: "Bob Johnson",
        username: "ceo",
        password: bcrypt.hashSync("password", 10),
        role: Role.CEO,
      },
    ],
  })

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "Power Drill",
        description: "High-performance power drill for all your DIY needs",
        price: 89.99,
      },
      {
        name: "Circular Saw",
        description: "Precision circular saw for smooth, accurate cuts",
        price: 129.99,
      },
      {
        name: "Cordless Screwdriver",
        description: "Compact and versatile cordless screwdriver",
        price: 49.99,
      },
    ],
  })

  console.log("Seed data created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

