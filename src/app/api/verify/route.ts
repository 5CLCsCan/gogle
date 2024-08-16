import { findAndUpdateData, findData } from '@/lib/backend/database'

import UserModel from '@/models/UserSchema'

import { NextApiRequest, NextApiResponse } from 'next'

// swagger

/**
 * @swagger
 * /api/verify:
 *   get:
 *     description: Verify user
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verify token
 *     responses:
 *       200:
 *         description: User verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User verified
 *                   example: User verified
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
 *       400:
 *         description: Token not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Token not valid
 *                   example: Token not valid
 *       406:
 *         description: Token expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Token expired
 *                   example: Token expired
 *       451:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Token not found
 *                   example: Token not found
 */

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  console.log(token)

  if (!token) {
    return new Response(
      JSON.stringify({ message: 'Missing token parameter' }),
      {
        status: 451,
      },
    )
  }

  // find user by verify token
  const user = await findData(UserModel, { verifyToken: token })

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
    })
  }

  // if token is expired
  const now = new Date()
  if (!user[0].verifyTokenExpires) {
    return new Response(JSON.stringify({ message: 'Token not valid' }), {
      status: 400,
    })
  }

  if (user[0].verifyTokenExpires < now) {
    return new Response(JSON.stringify({ message: 'Token expired' }), {
      status: 406,
    })
  }

  const updateUser = await findAndUpdateData(
    UserModel,
    { verifyToken: token },
    { isVerified: true, verifyToken: '', verifyTokenExpires: '' },
  )

  if (!updateUser) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
    })
  }

  return new Response(JSON.stringify({ message: 'User verified' }), {
    status: 200,
  })
}
