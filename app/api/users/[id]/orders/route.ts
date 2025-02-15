import { NextResponse } from "next/server"
import { db } from "@/src/db"
import { orderItems, orders, products } from "@/src/db/schema"
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id
  const ordersWithItemsAndProducts = await db
  .select({
    order: orders, // Выбираем все поля из таблицы `orders`
    items: {
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: products, // Выбираем все поля из таблицы `products`
    },
  })
  .from(orders)
  .leftJoin(orderItems, eq(orders.id, orderItems.orderId)) // Объединяем `orders` и `orderItems`
  .leftJoin(products, eq(orderItems.productId, products.id)) // Объединяем `orderItems` и `products`
  .where(eq(orders.userId, userId))
  return NextResponse.json(orders)
}

