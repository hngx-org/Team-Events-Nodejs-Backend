import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = (req: Request, res: Response) => {}

const getAllEvents = async (req: Request, res: Response) => {
	// Get all events
	const events = await prisma.event.findMany()
	if (events.length > 0) {
		res.status(200).json(events)
	} else {
		res.status(404).json({ error: 'No events found' })
	}
}

const getFriendEvent = async (req: Request, res: Response) => {
	try {
		const userId = '5c8e1b9f-c7f1-4578-bd6e-923832bdb903' // Get the user ID from the request [req.user.id]

		// Find all groups that the user belongs to
		const userGroups = await prisma.userGroup.findMany({
			where: {
				user_id: userId,
			},
			select: {
				group_id: true,
			},
		})

		// Find all events that belong to the groups that the user belongs to
		const groupIds = userGroups.map((userGroup) => userGroup.group_id)
		const friendEvents = await prisma.event.findMany({
			where: {
				event_group: {
					some: {
						group_id: {
							in: groupIds,
						},
					},
				},
			},
		})

		if (friendEvents.length > 0) {
			res.json(friendEvents)
		} else {
			res.json({ error: 'No events found' })
		}
	} catch (error) {
		console.error('Error fetching friend events:', error)
		res.status(500).json({ error: 'Error fetching friend events' })
	}
}

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
