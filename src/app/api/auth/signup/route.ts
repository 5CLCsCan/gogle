import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/backend/authentication/authentication';
import { jsonHeader } from '@/lib/backend/header/jsonheader';

export async function POST(request: NextRequest) {
  try{
    const data = await request.json();
    const result = await registerUser(data);
    return new NextResponse(JSON.stringify(result), jsonHeader);
  }
  catch(err){
    console.error("Error in signup route:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", token: "" }), jsonHeader);
  }
}
