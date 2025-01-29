import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json(userWithoutPassword)
}

