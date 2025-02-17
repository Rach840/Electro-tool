"use server";
import { cookies } from "next/headers";

export async function getCookies() {
  const cookie = await cookies();
  const user = cookie.get("user");
  return user ? JSON.parse(user.value) : false;
}
export async function setCookie(request) {
  const cookie = await cookies();
  cookie.set("user", request);
}

export async function deleteCookies() {
  const cookie = await cookies();
  cookie.delete("user");
}
