import { render } from '@react-email/render'

import WelcomeTemplate from '../../../emails'

import { sendVerifyEmail } from '@/lib/backend/email/verifyEmail'

import { Resend } from 'resend'

import { NextRequest, NextResponse } from 'next/server'

import { jsonHeader } from '@/lib/backend/header/jsonheader'

/**
 * @swagger
 * /api/mail:
 *   post:
 *     description: Send verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: hcmusgogle@gmail.com
 *               username:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Email sent successfully
 *                   example: Email sent successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User not found
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal Server Error
 *                   example: Internal Server Error
 */

export async function POST(request: NextRequest) {
  const { email, username } = await request.json()

  const result = await sendVerifyEmail(email, username)

  if (result.message === 'User not found') {
    return new NextResponse(JSON.stringify(result), { status: 404 })
  } else if (result.message === 'Internal Server Error') {
    return new NextResponse(JSON.stringify(result), { status: 500 })
  }
  return new NextResponse(JSON.stringify(result), jsonHeader)
}
