import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = (req: Request, res: Response) => {}

const getAllEvents = (req: Request, res: Response) => {}

const getFriendEvent = (req: Request, res: Response) => {}

const eventSearch = (req: Request, res: Response) => {}

const getEventById = (req: Request, res: Response) => {}

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById }
