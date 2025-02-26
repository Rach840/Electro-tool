"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eq, inArray } from "drizzle-orm";
import {
  cartItems,
  orderItems,
  orders,
  products,
  users,
} from "@/src/db/schema";
import { v4 as uuidv4 } from "uuid";
import { sendSalesMessageTelegram } from "@/src/shared/api/telegram/telegram-sales";

export async function POST(request: Request) {
  const [userId, cartProductsId, cartItemsId] = await request.json();

  const cartProuctsPrice = await db
    .select({id:products.id ,stock: products.stock, price: products.price })
    .from(products)
    .where(inArray(products.id, cartProductsId));

  const cartItemsQuantity = await db
    .select({
      productId: cartItems.productId,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .where(inArray(cartItems.id, cartItemsId));

  const orderId = uuidv4();
  const orderInsertItems = cartItemsQuantity.map((item, index) => {
    return {
      id: uuidv4(),
      orderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: cartProuctsPrice[index].price,
    };
  });

  await db.insert(orderItems).values(orderInsertItems);
  await db.delete(cartItems).where(inArray(cartItems.id, cartItemsId));


  const total = orderInsertItems.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0,
  );
  const user = await db.select().from(users).where(eq(users.id, userId));
  await db.insert(orders).values({
    id: orderId,
    userId: userId,
    total: total,
    status: "PROCESSED",
  });
  cartItemsQuantity.forEach(async (item) =>  {
    const productItem = cartProuctsPrice.find(
      (product) => product.id == item.productId,
    );

    await db.update(products).set({stock: productItem.stock - item.quantity}).where(eq(products.id, item.productId))

  });
  const message = `Оформлен заказ ${orderId} %0AПользователя ${user[0].name} ${user[0]?.lastName} %0AАдресс ${user[0]?.address} %0AТоваров в заказе ${orderInsertItems.length} %0AСумма заказа ${total} %0AПочта: ${user[0].email} %0AНомер телефона: ${user[0]?.phone ? user[0].phone : "Не найдено"} %0AДля получения подробной информации зайдите в панель заказов`;
  await sendSalesMessageTelegram(message);
  return NextResponse.json("success");
}
