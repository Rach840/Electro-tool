import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })
  return NextResponse.json(orders)
}

