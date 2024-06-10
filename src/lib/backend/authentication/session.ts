import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers";
import { encrypt, decrypt } from "./jwt";

const expireDuration = 24 * 60 * 60 * 1000;


// async function getSession(): Promise<Payload | null> {
//   try {
//     const session = cookies().get("session")?.value;
//     if (session) {
//       const data = await decrypt(session);
//       //console.log("Session data:", data);
//       return data;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error in getSession:", error);
//     return null;
//   }
// }


// async function updateSession(request: NextRequest): Promise<NextResponse> {
//   try {
//     const session = request.cookies.get("session")?.value;
//     if (!session) return NextResponse.next();

//     const parsed = await decrypt(session);

//     parsed.expires = new Date(Date.now() + expireDuration);

//     const encryptedSession = await encrypt(parsed);

//     const res = NextResponse.next();
//     res.cookies.set({
//       name: "session",
//       value: encryptedSession,
//       httpOnly: true,
//       expires: parsed.expires,
//     });

//     return res;
//   } catch (error) {
//     console.error("Error in updateSession:", error);
//     return NextResponse.next();
//   }
// }


// export { updateSession, encrypt, decrypt, expireDuration};