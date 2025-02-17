"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { and, eq } from "drizzle-orm";
import { cartItems, carts, orders, users } from "@/src/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    const cartItemId = await request.json();

    await db.delete(cartItems).where(eq(cartItemId, cartItems.id));
    return NextResponse.json("success");
}
