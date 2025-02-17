"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { and, eq, inArray } from "drizzle-orm";
import {
    cartItems,
    carts,
    orderItems,
    orders,
    products,
    users,
} from "@/src/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    const [userId, cartProductsId, cartItemsId] = await request.json();

    const cartProuctsPrice = await db
        .select({ price: products.price })
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

    await db.insert(orders).values({
        id: orderId,
        userId: userId,
        total: total,
        status: "PROCESSED",
    });
    return NextResponse.json("success");
}
