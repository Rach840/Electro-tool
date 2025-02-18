"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { cartItems } from "@/src/db/schema";

export async function POST(request: Request) {
  const cartItemId = await request.json();

  await db.delete(cartItems).where(eq(cartItemId, cartItems.id));
  return NextResponse.json("success");
}
