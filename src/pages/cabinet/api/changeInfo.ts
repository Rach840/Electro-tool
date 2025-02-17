"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function changeInfo(prevState, data) {
  const dataName = data.get("firstName");
  const dataLastName = data.get("lastName");
  const dataEmail = data.get("email");
  const dataPhone = data.get("phone");
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  const user = JSON.parse(userCookie.value);

  try {
    await db
      .update(users)
      .set({
        name: dataName,
        lastName: dataLastName,
        email: dataEmail,
        phone: dataPhone,
      })
      .where(eq(users.id, user.id));
    const newUser = await db.select().from(users).where(eq(users.id, user.id));

    cookieStore.set("user", JSON.stringify(newUser[0]));
    return "Ваш профиль успешно изменён!";
  } catch (e) {
    return "Прозошла ошибка!";
  }
}
