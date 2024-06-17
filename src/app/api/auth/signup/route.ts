import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/backend/authentication/authentication'
import { jsonHeader } from '@/lib/backend/header/jsonheader'

/**
 *   @swagger
 *   /api/auth/signup:
 *    post:
 *       description: Sign in a user and return a token
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           username:
 *                              type: string
 *                              example: user
 *                           email:
 *                               type: string
 *                               example: user@gmail.com
 *                           password:
 *                               type: string
 *                               example: IAMPASSWORD
 *       responses:
 *           200:
 *               description: Successfully signed up and returned a token
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
 *           409:
 *               description: Email already exists
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               error:
 *                                   type: string
 *                                   description: Email already exists
 *                                   example: Email already exists
 *                               token:
 *                                   type: string
 *                                   description: Empty string
 *                                   example: ""
 *           500:
 *               description: Internal Server Error
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               error:
 *                                   type: string
 *                                   description: Internal Server Error
 *                                   example: Internal Server Error
 *                               token:
 *                                   type: string
 *                                   description: Empty string
 *                                   example: ""
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await registerUser(data)
    if (result.error == 'Email already exists') {
      return new NextResponse(JSON.stringify(result), { status: 409 })
    }
    return new NextResponse(JSON.stringify(result), jsonHeader)
  } catch (err) {
    console.error('Error in signup route:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', token: '' }),
      jsonHeader,
    )
  }
}
