import bcrypt from 'bcryptjs'
import { connectDB, addData, findData } from '@/lib/backend/database'
import UserModel from '@/models/UserSchema'
import { encrypt, decrypt } from './jwt'
import { Payload } from './jwt'
import { cookies } from 'next/headers'
import { sendVerifyEmail } from '../email/verifyEmail'

const expiredDuration = 1000

interface RegisterUserData {
  username: string
  email: string
  password: string
}

interface LoginUserData {
  email: string
  password: string
}

interface TokenObject {
  error: string
  token: string
}

async function generateToken(email: string): Promise<TokenObject> {
  const expires = new Date(Date.now() + expiredDuration)
  const token = await encrypt({ email, expires })
  return { error: '', token: token } as TokenObject
}

async function checkEmailExist(email: string): Promise<boolean> {
  const user = await findData(UserModel, { email: email })
  if (!user) return false
  return user.length > 0
}

async function registerUser(data: RegisterUserData): Promise<TokenObject> {
  const { username, email, password } = data

  if (await checkEmailExist(email)) {
    return { error: 'Email already exists', token: '' } as TokenObject
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new UserModel({ username, email, password: hashedPassword })
  const status = await addData(user)

  if (status) {
    await sendVerifyEmail(email, username)
  }

  if (!status) {
    return { error: 'Internal Server Error', token: '' } as TokenObject
  }

  return await generateToken(email)
}

async function loginUser(data: LoginUserData): Promise<TokenObject> {
  const { email, password } = data

  const user = await findData(UserModel, { email: email })
  if (!user) {
    return { error: 'Invalid email or password', token: '' } as TokenObject
  }

  const match = await bcrypt.compare(password, user[0].password)
  if (!match) {
    return { error: 'Invalid email or password', token: '' } as TokenObject
  }

  // check if user is verified
  if (!user[0].isVerified) {
    return { error: 'User not verified', token: '' } as TokenObject
  }

  return await generateToken(email)
}

export { registerUser, loginUser, generateToken, expiredDuration }
