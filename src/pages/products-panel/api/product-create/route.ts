"use server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";

export async function POST(request: Request) {
  const [productId,product,image] = await request.json();

await db.insert(products).values({
id: productId,
  name: product.name,
  price: product.price,
  image: image,
  description: product.description,
  category: product.category,
  stock: product.stock,
})
  return NextResponse.json(product);
}
