import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = (req: Request, res: Response) => {}

const getAllEvents = (req: Request, res: Response) => {}

const getFriendEvent = (req: Request, res: Response) => {}

const eventSearch = (req: Request, res: Response) => {}

const getEventById = (req: Request, res: Response) => {}

const deleteEvent = async (req: Request, res: Response) => {
	const eventId = req.params.eventId
	const event = await prisma.event.findUnique({ where: { id: eventId } })
	if (!event) return res.status(404).json({ message: 'Event not found' })
	// Delete event from database
	await prisma.event.delete({ where: { id: eventId } })
	// TODO: Delete image from cloudinary
	res.status(200).json({ message: 'Event deleted successfully' })
}

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById, deleteEvent }
