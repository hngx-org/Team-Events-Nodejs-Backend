import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const googleAuth = (req: Request, res: Response) => {}

const twitterAuth = (req: Request, res: Response) => {}

const logout = (req: Request, res: Response) => {}

export { googleAuth, twitterAuth, logout }
