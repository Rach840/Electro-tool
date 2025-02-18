"use server";
import { db } from "@/src/db";
import { orders, users } from "@/src/db/schema";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const ordersAll = await db.select().from(orders);
  console.log(ordersAll);
  const usersId = ordersAll.map((order) => order.userId);

  const userItemsById = await db
    .select()
    .from(users)
    .where(inArray(users.id, usersId));

  function getDate(str) {
    const date = new Date(str);
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return date.toLocaleString("ru", options);
  }
  const orderFull = ordersAll.map((item) => {
    const user = userItemsById.find((userItem) => userItem.id === item.userId);
    return {
      id: item.id,
      total: item.total,
      user: user,
      createdAt: getDate(item.createdAt),
      status: item.status,
    };
  });
  return NextResponse.json(orderFull);
}
