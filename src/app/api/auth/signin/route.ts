import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/backend/authentication/authentication";
import { jsonHeader } from "@/lib/backend/header/jsonheader";

/**
 * @swagger
 * /api/hello:
 *  get:
 *      description: Returns the hello world
 *      responses:
 *          200:
 *              description: Hello World     
 */

/**
*   @swagger
*   /api/auth/signin:
*    post:
*       description: Sign in a user and return a token
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           email:
*                               type: string
*                           password:
*                               type: string
*       responses:
*           200:
*               description: Successfully signed in and returned a token
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                               error:
*                                   type: string
*                                   description: Empty string
*                               token:
*                                   type: string
*                                   description: JWT token
*           401:
*               description: Invalid email or password
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                               error:
*                                   type: string
*                                   description: Invalid email or password
*                               token:
*                                   type: string
*                                   description: Empty string
*/

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;
    const result = await loginUser({ email, password });
    console.log(result);
    if (result.error != "") {
      return new NextResponse(JSON.stringify(result), { status: 401 });
    }
    return new NextResponse(JSON.stringify(result), jsonHeader);
  } catch (err) {
    console.error("Error in signin route:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", token: "" }),
      jsonHeader
    );
  }
}
