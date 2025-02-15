import { NextResponse } from "next/server"
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { orders, users } from "@/src/db/schema"

export async function GET() {
  const allOrders = await db
  .select({
    id: orders.id,
    total: orders.total,
    createdAt: orders.createdAt,
    userName: users.name,
  })
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))

  return NextResponse.json(allOrders)
}

