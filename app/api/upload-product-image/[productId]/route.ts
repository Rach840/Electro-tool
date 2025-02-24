import { s3 } from "@/src/shared/utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  if (!req.headers.get("Content-Type")?.startsWith("image"))
    return new NextResponse(null, { status: 400 });
  const { productId } = await params;
  console.log(productId)
  const Body = Buffer.from(await req.arrayBuffer());
  const Key = `products/${productId}/${Date.now()}.png`;

  if (Body.byteLength > 5 * 1024 * 1024)
    return new NextResponse(null, { status: 400 });

  await s3.send(
    new PutObjectCommand({
      Bucket: "kvf",
      Key,
      Body,
    }),
  );

  const url = `https://kvf.storage.yandexcloud.net/${Key}`;

  return NextResponse.json({ url });
}
