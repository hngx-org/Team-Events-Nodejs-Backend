import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createGroup = (req: Request, res: Response) => {}

const getUserGroups = (req: Request, res: Response) => {}

const getGroupById = (req: Request, res: Response) => {}

const getGroupEvent = (req: Request, res: Response) => {}

export { createGroup, getUserGroups, getGroupById, getGroupEvent }
