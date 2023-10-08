import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const createEvent = (req: Request, res: Response) => {};

const getAllEvents = async (req: Request, res: Response) => {
	// Get all events
	const events = await prisma.event.findMany();
	if (events.length > 0) {
		res.status(200).json(events);
	} else {
		res.status(404).json({ error: 'No events found' });
	}
};

const getFriendEvent = (req: Request, res: Response) => {};

const eventSearch = (req: Request, res: Response) => {};

const getEventById = (req: Request, res: Response) => {};

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById };
