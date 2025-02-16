import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";

export async function GET() {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
}
