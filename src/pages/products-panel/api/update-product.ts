'use server'

import {db} from "@/src/db";
import {products} from "@/src/db/schema";
import {eq} from "drizzle-orm";

export async function updateProduct(data) {
    await db.update(products).set({
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        stock: data.stock,
        manufacturer:data.manufacturer,
    }).where(eq(products.id, data.id));
}