"use server";
import { db } from "@/src/db";
import { orderItems, orders, products, users } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const orderId = await params;
  console.log(orderId);
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orderId.id, orders.id));
  console.log(userOrders);
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userOrders[0].userId));
  const ordersId = userOrders.map((order) => order.id);

  const orderItemsById = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, ordersId));

  const orderItemsOnlyId = orderItemsById.map((items) => items.productId);
  const cartItemsOnlyProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, orderItemsOnlyId));

  const orderItemsFull = userOrders.map((item) => {
    const orderItemsWithProduct = orderItemsById
      .filter((orderItem) => orderItem.orderId === item.id)
      .map((orderItem) => {
        const productByItem = cartItemsOnlyProducts.find(
          (product) => product.id === orderItem.productId,
        );
        return {
          ...productByItem,
          quantity: orderItem.quantity,
          total: productByItem.price * orderItem.quantity,
        };
      });

    return {
      id: item.id,
      total: item.total,
      createdAt: item.createdAt,
      status: item.status,
      orderItems: orderItemsWithProduct,
      orderTotal: orderItemsWithProduct.reduce(
        (total, orderItem) => total + orderItem.total,
        0,
      ),
    };
  });
  return NextResponse.json({
    user: user[0],
    orderDetails: orderItemsFull[0],
  });
}
