import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/backend/authentication/authentication";
import { jsonHeader } from "@/lib/backend/header/jsonheader";

export async function POST(request: NextRequest) {
  try{
    const data = await request.json();
    const { email, password } = data;
    const result = await loginUser({ email, password });
    console.log(result);
    if (result.error != "") {
      return new NextResponse(JSON.stringify(result), { status: 401 });
    }
    return new NextResponse(JSON.stringify(result), jsonHeader);
  }
  catch(err){
    console.error("Error in signin route:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", token: "" }), jsonHeader);
  }
}
