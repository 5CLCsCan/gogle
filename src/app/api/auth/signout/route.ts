import { logoutUser } from "@/lib/backend/authentication/authentication";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    await logoutUser();
    return new NextResponse(JSON.stringify({message: "User logged out successfully"}), { status: 200 });
  } catch (error) {
    console.error("Error logging out user:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}