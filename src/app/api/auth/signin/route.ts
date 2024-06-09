import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/backend/authentication/authentication";
import { jsonHeader } from "@/lib/backend/header/jsonheader";

export async function POST(request: NextRequest) {
  try{
    const data = await request.json();
    const { email, password } = data;
    console.log
    const result = await loginUser({ email, password });
    console.log(result);
    return new NextResponse(JSON.stringify(result), jsonHeader);
  }
  catch(err){
    console.error("Error in signin route:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", token: "" }), jsonHeader);
  }
}
