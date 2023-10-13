import { Event, PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
import cloudinary from '../config/cloudinaryConfig';
const prisma = new PrismaClient();

const createEvent = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;

		const requestSchema = Joi.object({
			event_name: Joi.string().required(),
			event_description: Joi.string().required(),
			event_start: Joi.date().iso().required(),
			event_end: Joi.date().iso().required(),
			location: Joi.string().required(),
			groupId: Joi.string(),
		});

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { event_name, event_description, event_start, event_end, location, groupId } = req.body;

		// Check if a file is uploaded
		if (!req.file) return res.status(400).json({ error: 'Image is required' });

		// File upload (cloudinary)
		const { secure_url } = await cloudinary.uploader.upload(req.file.path);

		const newEvent = await prisma.event.create({
			data: {
				event_name,
				event_description,
				image: secure_url,
				event_start,
				event_end,
				location,
				created_by: userId,
			},
		});

		// Associate the event with a group
		if (groupId) {
			await prisma.eventGroup.create({
				data: {
					event: { connect: { id: newEvent.id } },
					group: { connect: { id: groupId } },
				},
			});
		}

		res.status(201).json({
			statusCode: 201,
			message: 'Event created successfully',
			data: newEvent,
		});
	} catch (error) {
		console.error('Error creating event:', error);
		res.status(500).json({ error: 'Error creating event' });
	}
};

// update event
const updateEvent = async (req: Request, res: Response) => {
	try {
		const requestSchema = Joi.object({
			event_name: Joi.string(),
			event_description: Joi.string(),
			event_start: Joi.date().iso(),
			event_end: Joi.date().iso(),
			location: Joi.string(),
		});

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { event_name, event_description, event_start, event_end, location } = req.body;

		const { secure_url } = await cloudinary.uploader.upload(req.file.path);

		const updateEvent: Event = await prisma.event.update({
			where: {
				id: req.params.eventId,
			},
			data: {
				event_name,
				event_description,
				image: secure_url,
				event_start,
				event_end,
				location,
			},
		});

		res.status(201).json({
			statusCode: 201,
			message: 'Event updated successfully',
			data: updateEvent,
		});
	} catch (error) {
		console.error('Error creating event:', error);
		res.status(500).json({ error: 'Error updating event' });
	}
};

const getAllEvents = async (req: Request, res: Response) => {
	// Get all events
	const events = await prisma.event.findMany();
	if (events.length > 0) {
		res.status(200).json(events);
	} else {
		res.status(404).json({ error: 'No events found' });
	}
};

const getFriendEvent = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;

		// Find all groups that the user belongs to
		const userGroups = await prisma.userGroup.findMany({
			where: {
				user_id: userId,
			},
			select: {
				group_id: true,
			},
		});

		// Find all events that belong to the groups that the user belongs to
		const groupIds = userGroups.map((userGroup) => userGroup.group_id);
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
		});

		if (friendEvents.length > 0) {
			res.json(friendEvents);
		} else {
			res.json({ error: 'No events found' });
		}
	} catch (error) {
		console.error('Error fetching friend events:', error);
		res.status(500).json({ error: 'Error fetching friend events' });
	}
};

const eventSearch = async (req: Request, res: Response) => {
	if (typeof req.query.keyword != 'string') {
		return res.status(400).json({
			error: 'invalid keyword value',
			message: 'keyword must be a string',
			statusCode: 400,
		});
	}
	const keyWord: string = req.query.keyword;
	try {
		const searchResults = await prisma.event.findMany({
			where: {
				OR: [
					{
						event_name: {
							contains: keyWord,
							mode: 'insensitive', // Perform case-insensitive search
						},
					},
					{
						event_description: {
							contains: keyWord,
							mode: 'insensitive',
						},
					},
				],
			},
		});

		if (searchResults.length === 0) {
			return res.status(404).json({
				error: 'A match could not be  found',
				message: 'No match was found',
				statusCode: 404,
			});
		}
		return res.status(200).json({
			statusCode: 200,
			message: 'successful',
			data: searchResults,
		});
	} catch (error) {
		res.status(500).json({
			error: 'Something went wrong when trying to search for event',
			message: error.message,
			statusCode: 500,
		});
	}
};

const getEventById = async (req: Request, res: Response) => {
	const requestSchema = Joi.object({
		eventId: Joi.string().required(),
	});

	const { error } = requestSchema.validate(req.params);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const eventId: string = req.params.eventId;
	const event = await prisma.event.findFirst({
		where: {
			id: eventId,
		},
	});
	if (!event) {
		return res.status(404).json({
			statusCode: 404,
			message: 'Resource could not be found',
			error: 'Specified event does not exist',
		});
	}
	return res.status(200).json({
		data: event,
		statusCode: 200,
		message: 'success',
	});
};

const deleteEvent = async (req: Request, res: Response) => {
	const requestSchema = Joi.object({
		eventId: Joi.string().required(),
	});

	const { error } = requestSchema.validate(req.params);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const eventId = req.params.eventId;
	const event = await prisma.event.findUnique({ where: { id: eventId } });
	if (!event) return res.status(404).json({ message: 'Event not found' });
	// Delete event from database
	await prisma.event.delete({ where: { id: eventId } });
	// Delete image from cloudinary
	if (event.image) {
		// Extract the public ID from the image URL
		const publicId = event.image.split('/v')[1].split('/')[1];
		await cloudinary.uploader.destroy(publicId);
	}
	res.status(200).json({ message: 'Event deleted successfully' });
};

export { createEvent, deleteEvent, eventSearch, getAllEvents, getEventById, getFriendEvent, updateEvent };
