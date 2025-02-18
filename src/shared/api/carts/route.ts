"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { and, eq } from "drizzle-orm";
import { cartItems, carts } from "@/src/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const [userId, product] = await request.json();

  let cart = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(userId, carts.userId));
  let productExists = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cart[0].id, cartItems.cartId),
        eq(cartItems.productId, product.id),
      ),
    );
  if (productExists.length) {
    await db
      .update(cartItems)
      .set({ quantity: productExists[0].quantity + 1 })
      .where(
        and(
          eq(cart[0].id, cartItems.cartId),
          eq(cartItems.productId, product.id),
        ),
      );
  } else {
    await db.insert(cartItems).values({
      id: uuidv4(),
      cartId: cart[0].id,
      productId: product.id,
      quantity: 1,
    });
  }
  return NextResponse.json(product);
}
