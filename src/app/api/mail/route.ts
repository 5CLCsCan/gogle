import { render } from '@react-email/render'

import WelcomeTemplate from '../../../emails'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request, respond: Response) {
  const { email, username } = await request.json()

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Thank you for registering with us',
    html: render(WelcomeTemplate({ userFirstname: username })),
  })

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ message: 'Email sent successfully' })
}
