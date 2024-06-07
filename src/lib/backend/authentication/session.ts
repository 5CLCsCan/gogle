import { NextRequest, NextResponse } from "next/server";
import {decrypt, encrypt} from "@/lib/backend/authentication/authentication"

const expireDuration = 24 * 60 * 60 * 1000;

async function updateSession(request: NextRequest): Promise<NextResponse> {
    try {
      const session = request.cookies.get("session")?.value;
      if (!session) return NextResponse.next(); 
  
      const parsed = await decrypt(session);
  
      parsed.expires = new Date(Date.now() + expireDuration);
  
      const encryptedSession = await encrypt(parsed);
  
      const res = NextResponse.next();
      res.cookies.set({
        name: "session",
        value: encryptedSession,
        httpOnly: true,
        expires: parsed.expires,
      });
  
      return res;
    } catch (error) {
      console.error("Error in updateSession:", error);
      return NextResponse.next();
    }
  }
  

  export {updateSession};