import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/backend/authentication/authentication'
import { jsonHeader } from '@/lib/backend/header/jsonheader'

/**
 * @swagger
 * /api/auth/gettoken:
 *  get:
 *   description: Get a new token
 *  responses:
 *   200:
 *    description: Successfully returned a new token
 *   401:
 *    description: No decoded header found
 */

export async function GET(request: NextRequest) {
  const decodedHeader = request.headers.get('decoded')

  if (decodedHeader) {
    const decodedPayload = JSON.parse(decodedHeader)
    const email = decodedPayload.email
    const result = await generateToken(email)

    console.log(result)
    if (result.error != '') {
      return new NextResponse(JSON.stringify(result), { status: 401 })
    }

    return new NextResponse(JSON.stringify(result), jsonHeader)
  } else {
    return new NextResponse(
      JSON.stringify({ error: 'No decoded header found', token: '' }),
      { status: 401 },
    )
  }
}
