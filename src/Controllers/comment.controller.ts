import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createComment = (req: Request, res: Response) => {}

const getComments = (req: Request, res: Response) => {}

export { createComment, getComments }
