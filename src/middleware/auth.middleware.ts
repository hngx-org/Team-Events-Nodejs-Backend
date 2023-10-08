import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded: any = jwt.verify(token, process.env.SECRET_KEY)

      req.user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          email: true,
        },
      })

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({
        status: 401,
        message: 'There was an issue authorizing token',
        data: null,
      })
    }
  } else {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      data: null,
    })
  }
}

export default protect
