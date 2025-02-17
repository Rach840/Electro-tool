"use server";
import { orders, users } from "@/src/db/schema";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { sendSalesMessageTelegram } from "@/src/shared/api/telegram/telegram-sales";

export async function approveDeliver(orderId: string): Promise<void> {
  await db
    .update(orders)
    .set({ status: "DELIVERED" })
    .where(eq(orders.id, orderId));
  const changedOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, changedOrder[0].userId));

  const message = `Заказ ${changedOrder[0].id} %0AПользователя ${user[0].name} ${user[0]?.lastName} доставлен %0AПочта: ${user[0].email} %0AНомер телефона: ${user[0]?.phone ? user[0].phone : "Не найдено"}`;
  await sendSalesMessageTelegram(message);
}
export async function deniedDeliver(orderId: string): Promise<void> {
  await db
    .update(orders)
    .set({ status: "FAILED" })
    .where(eq(orders.id, orderId));
  const changedOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, changedOrder[0].userId));

  const message = `!ЗАКАЗ НЕ ДОСТАВЛЕН! %0AЗаказ ${changedOrder[0].id} %0AПользователя ${user[0].name} ${user[0]?.lastName} не доставлен %0AПочта: ${user[0].email} %0AНомер телефона: ${user[0]?.phone ? user[0].phone : "Не найдено"} %0AСвяжитесь с пользователем для выяснение подробностей`;
  await sendSalesMessageTelegram(message);
}
