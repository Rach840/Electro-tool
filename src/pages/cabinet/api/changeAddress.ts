"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function updateAddress(id, address) {
  const cookieStore = await cookies();

  try {
    await db
      .update(users)
      .set({
        address: address,
      })
      .where(eq(users.id, id));
    const newUser = await db.select().from(users).where(eq(users.id, id));

    cookieStore.set("user", JSON.stringify(newUser[0]));
    return "Ваш профиль успешно изменён!";
  } catch (e) {
    return "Прозошла ошибка!";
  }
}
