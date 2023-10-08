import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = (req: Request, res: Response) => {}

const getAllEvents = (req: Request, res: Response) => {}

const getFriendEvent = (req: Request, res: Response) => {}

const eventSearch = (req: Request, res: Response) => {}

const getEventById = async (req: Request, res: Response) => {
    const eventId: string = req.params.eventId
    const event = await prisma.event.findFirst({
                    where: {
                    id: eventId
                }})
    if (!event) {
        return res.status(404).json({
            statusCode: 404,
            message: "Resource could not be found",
            error: "Specified event does not exist"
        })
    }
    return res.status(200).json({
        data: event,
        statusCode: 200,
        message: "success"
    })
}

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById }
