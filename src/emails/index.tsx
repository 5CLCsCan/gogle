import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface GogleWelcomeEmailProps {
  userFirstname: string
  link: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''

export const GogleWelcomeEmail = ({
  userFirstname,
  link,
}: GogleWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>The trip planning website that you need (or not).</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/Gogle-logo.png`}
          width='170'
          height='50'
          alt='Gogle'
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Welcome to Gogle, Discover your perfect adventure. Plan, book, and
          explore with Gogle.
        </Text>
        <Section style={btnContainer}>
          <a style={button} href={link}>
            Get started
          </a>
        </Section>
        <Text style={paragraph}>
          Best regard,
          <br />
          5CLCsCan
        </Text>
        <Hr style={hr} />
        <Text style={footer}>227 Nguyen Van Cu, Q.5, TP.HCM</Text>
      </Container>
    </Body>
  </Html>
)

GogleWelcomeEmail.PreviewProps = {
  userFirstname: 'Alan',
} as GogleWelcomeEmailProps

export default GogleWelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const btnContainer = {
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
