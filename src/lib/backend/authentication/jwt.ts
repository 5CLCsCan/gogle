import { JWTPayload, SignJWT, jwtVerify, decodeJwt } from 'jose'
import { JWTExpired } from 'jose/errors'
import { JWTInvalid } from 'jose/errors'

const secretKey = process.env.JWT_SECRET!
const key = new TextEncoder().encode(secretKey)
const expireDuration = '24h'

interface Payload extends JWTPayload {
  email: string
  expires: Date
}

interface DecryptResult {
  payload?: Payload
  error?: string
  details?: string
}

async function encrypt(payload: Payload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expireDuration)
    .sign(key)
}

async function decrypt(token: string): Promise<DecryptResult> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return { payload: payload as Payload } // Ensure the payload type is explicitly casted to Payload
  } catch (error) {
    if (error instanceof JWTExpired) {
      const payload = decodeJwt(token) as Payload
      return {
        payload: payload as Payload,
        error: 'Token expired',
        details: error.message,
      }
    } else if (error instanceof JWTInvalid) {
      return { error: 'Invalid token', details: error.message }
    } else if (error instanceof Error) {
      return { error: 'Decryption failed', details: error.message }
    } else {
      return { error: 'Unknown error', details: JSON.stringify(error) }
    }
  }
}

export { encrypt, decrypt, type Payload } // Export Payload type along with the functions
