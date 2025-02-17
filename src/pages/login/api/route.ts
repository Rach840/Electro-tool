import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await db.select().from(users).where(eq(users.email, email));

  if (!user || !bcrypt.compareSync(password, user[0].password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user[0];
  return NextResponse.json(userWithoutPassword);
}
