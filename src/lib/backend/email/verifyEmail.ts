import { render } from '@react-email/render'

import WelcomeTemplate from '../../../emails'

import { Resend } from 'resend'

import UserModel from '../../../models/UserSchema'

import { addData, findData, findAndUpdateData } from '../database'

import { v4 as uuidv4 } from 'uuid'

import { expiredDuration } from '../authentication/authentication'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendVerifyEmail(email: string, username: string): Promise<void> {
  // find user by email
  const user = await findData(UserModel, { email: email })
  if (!user) {
    throw new Error('User not found')
  }

  // generate verify token
  const verifyToken = uuidv4()

  // expiration time
  const verifyTokenExpires = new Date(Date.now() + expiredDuration)

  const link = `${process.env.DOMAIN}/api/verify?token=${verifyToken}`

  // save verify token to user
  const updatedUser = await findAndUpdateData(
    UserModel,
    { email: email },
    { verifyToken: verifyToken, verifyTokenExpires: verifyTokenExpires },
  )

  console.log(email)

  if (!updatedUser) {
    throw new Error('Error updating user')
  }

  const { data, error } = await resend.emails.send({
    from: 'Gogle <noreply@resend.dev>',
    to: [email],
    subject: 'Thank you for registering with us',
    html: render(WelcomeTemplate({ userFirstname: username, link: link })),
  })

  if (error) {
    // Handle error
    throw new Error('Email not sent')
  }
}

export { sendVerifyEmail }
