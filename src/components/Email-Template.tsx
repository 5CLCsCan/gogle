import * as React from 'react'

interface EmailVerificationTemplateProps {
  firstName: string
  verificationLink: string
}

export const EmailVerificationTemplate: React.FC<
  Readonly<EmailVerificationTemplateProps>
> = ({ firstName, verificationLink }) => (
  <div>
    <h1>Hello, {firstName}!</h1>
    <p>
      Thank you for registering with us. Please click the link below to verify
      your email address:
    </p>
    <a href={verificationLink}>Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
  </div>
)
