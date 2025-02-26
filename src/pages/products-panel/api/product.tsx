'use server'
import { db } from "@/src/db";
import { orderItems, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getProduct(id:string) {
const product = await db.select().from(products).where(eq(products.id, id));
const productSaled = await db.select().from(orderItems).where(eq(id, orderItems.productId));
return [product[0], productSaled.length];
}
export async function deleteProduct(id:string) {
  await db.delete(products).where(eq(products.id, id));
}