import { decrypt } from "@/lib/backend/authentication/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return new NextResponse("Hello");
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const result = await decrypt(data.token);
  if (result.error) console.log("errror");
  else console.log("Payload");
  return new NextResponse("HElo");
}
