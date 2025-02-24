

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Product } from "@/src/db/schema";


export default async function GET(responce: Product[]) {

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(responce);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=products.xlsx",
    },
  });
}
