import { db } from "./index";
import { users, products } from "./schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function seed() {
  // Seed users
  await db.insert(users).values([
    {
      id: uuidv4(),
      name: "John Doe",
      email: "client",
      password: bcrypt.hashSync("password", 10),
      role: "CLIENT",
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
      email: "sales",
      password: bcrypt.hashSync("password", 10),
      role: "SALES_MANAGER",
    },
    {
      id: uuidv4(),
      name: "Bob Johnson",
      email: "ceo",
      password: bcrypt.hashSync("password", 10),
      role: "CEO",
    },
  ]);

  // Seed products
  await db.insert(products).values([
    {
      id: uuidv4(),
      name: "Professional Power Drill",
      description:
        "High-performance power drill with advanced torque control and long battery life",
      price: 8999, // Price in cents of ETH
      category: "Power Tools",
      rating: 48, // Rating out of 50 (4.8)
    },
    {
      id: uuidv4(),
      name: "Industrial Circular Saw",
      description:
        "Heavy-duty circular saw with laser guide and dust collection system",
      price: 12999,
      category: "Cutting Tools",
      rating: 47,
    },
    {
      id: uuidv4(),
      name: "Cordless Impact Driver",
      description:
        "Compact and powerful impact driver with brushless motor technology",
      price: 4999,
      category: "Power Tools",
      rating: 49,
    },
  ]);

  console.log("Seed data created successfully");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.end();
  });
