import { findAndUpdateData, findData } from '@/lib/backend/database'

import UserModel from '@/models/UserSchema'

import { NextApiRequest, NextApiResponse } from 'next'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  console.log(token)

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token parameter' }), {
      status: 400,
    })
  }

  // find user by verify token
  const user = await findData(UserModel, { verifyToken: token })

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    })
  }

  // if token is expired
  if (new Date(user.verifyTokenExpires) < new Date()) {
    return new Response(JSON.stringify({ error: 'Token expired' }), {
      status: 400,
    })
  }

  const updateUser = await findAndUpdateData(
    UserModel,
    { verifyToken: token },
    { isVerified: true, verifyToken: '' },
  )

  if (!updateUser) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    })
  }

  return new Response(JSON.stringify({ message: 'User verified' }), {
    status: 200,
  })
}
