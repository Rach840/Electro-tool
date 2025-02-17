"use server";
import { orders } from "@/src/db/schema";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";

export async function approveDeliver(orderId: string): Promise<void> {
    await db
        .update(orders)
        .set({ status: "DELIVERED" })
        .where(eq(orders.id, orderId));
}
export async function deniedDeliver(orderId: string): Promise<void> {
    await db
        .update(orders)
        .set({ status: "FAILED" })
        .where(eq(orders.id, orderId));
}
