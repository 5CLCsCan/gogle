import { render } from '@react-email/render'

import WelcomeTemplate from '../../../emails'

import { sendVerifyEmail } from '@/lib/backend/email/verifyEmail'

import { Resend } from 'resend'

import { NextRequest, NextResponse } from 'next/server'

import { jsonHeader } from '@/lib/backend/header/jsonheader'

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
