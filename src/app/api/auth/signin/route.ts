import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/backend/authentication/authentication'
import { jsonHeader } from '@/lib/backend/header/jsonheader'

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
 *                               example: user@gmail.com
 *                           password:
 *                               type: string
 *                               example: IAMPASSWORD
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
 *                                   example: ""
 *                               token:
 *                                   type: string
 *                                   description: JWT token
 *                                   example: IAMTOKEN12134
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
 *                                   example: Invalid email or password
 *                               token:
 *                                   type: string
 *                                   description: Empty string
 *                                   example: ""
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, password } = data
    const result = await loginUser({ email, password })
    console.log(result)
    if (result.error != '') {
      return new NextResponse(JSON.stringify(result), { status: 401 })
    }
    return new NextResponse(JSON.stringify(result), jsonHeader)
  } catch (err) {
    console.error('Error in signin route:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', token: '' }),
      jsonHeader,
    )
  }
}
