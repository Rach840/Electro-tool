import { NextResponse } from "next/server"
import prisma from "../../../../../lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
  return NextResponse.json(orders)
}

