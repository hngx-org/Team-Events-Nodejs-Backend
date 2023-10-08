import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { authUrl, oauth2Client, google } from '../config/google.config'
import { generateToken } from '../utils'
const prisma = new PrismaClient()

const googleAuth = (req: Request, res: Response) => {
  res.redirect(authUrl)
}

const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    const userExists = await prisma.user.findFirst({
      where: {
        auth_id: data.id,
      },
    })

    if (!userExists) {
      const newUser = await prisma.user.create({
        data: {
          auth_method: 'google',
          auth_id: data.id,
          email: data.email ? data.email : null,
        },
      })

      //generate accessToken
      const token: string = generateToken(newUser.id)
      //return token
      res.status(201).json({
        statusCode: 201,
        message: 'User created',
        data: {
          id: newUser.id,
          token,
        },
      })
    } else {
      //generate access token
      const token: string = generateToken(userExists.id)
      //return token
      res.status(200).json({
        statusCode: 200,
        message: 'User created',
        data: {
          id: userExists.id,
          token,
        },
      })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).send('Authentication error')
  }
}

const twitterAuth = (req: Request, res: Response) => {}

const logout = (req: Request, res: Response) => {}

export { googleAuth, twitterAuth, logout, callback }
