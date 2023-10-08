import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = (req: Request, res: Response) => {}

const getAllEvents = (req: Request, res: Response) => {}

const getFriendEvent = (req: Request, res: Response) => {}

const eventSearch = (req: Request, res: Response) => {}

const getEventById: Response = (req: Request, res: Response) => {
    const eventId: string = req.params.eventId
    const event = prisma.event.findFirst({
                    where: {
                    id: eventId
                }})
    if (!event) {
        return res.status(404).json({error: "event does not exist"})
    }
    return res.status(200).json({message: "success"})
}

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById }
