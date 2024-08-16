import { render } from '@react-email/render'

import WelcomeTemplate from '../../../emails'

import { Resend } from 'resend'

import UserModel from '../../../models/UserSchema'

import { addData, findData, findAndUpdateData } from '../database'

import { v4 as uuidv4 } from 'uuid'

import { expiredDuration } from '../authentication/authentication'

interface verifyEmailData {
  message: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendVerifyEmail(
  email: string,
  username: string,
): Promise<verifyEmailData> {
  // find user by email
  const user = await findData(UserModel, { email: email })
  if (!user) {
    return { message: 'User not found' } as verifyEmailData
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
    return { message: 'User not found' } as verifyEmailData
  }

  const { data, error } = await resend.emails.send({
    from: 'Gogle <noreply@gogle.studio>',
    to: [email],
    subject: 'Thank you for registering with us',
    html: render(WelcomeTemplate({ userFirstname: username, link: link })),
  })

  if (error) {
    // Handle error
    return { message: 'Internal Server Error' } as verifyEmailData
  }

  return { message: 'Email sent successfully' } as verifyEmailData
}

export { sendVerifyEmail }
