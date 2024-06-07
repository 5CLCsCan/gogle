import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/backend/authentication/authentication";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const response = await loginUser({ email, password });

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error logging in user:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}