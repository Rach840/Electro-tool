"use server";
import { db } from "@/src/db";
import { cartItems, carts, products } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await params;
  const cartId = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(user.id, carts.userId));
  const cartItemsById = await db
    .select()
    .from(cartItems)
    .where(eq(cartId[0].id, cartItems.cartId));
  const cartItemsOnlyId = cartItemsById.map((items) => items.productId);
  const cartItemsOnlyProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, cartItemsOnlyId));
  const cartItemsFull = cartItemsById.map((item) => {
    const productItem = cartItemsOnlyProducts.find(
      (product) => product.id == item.productId,
    );
    return {
      orderItem: item,
      product: productItem,
    };
  });

  return NextResponse.json(cartItemsFull);
}
