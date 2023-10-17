import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
const prisma = new PrismaClient();

const getUserPreference = async (req: Request, res: Response) => {
	const userId = (req.user as User).id;

	try {
		const userPreferences = await prisma.userPreference.findUnique({
			where: {
				id: userId,
			},
		});

		if (userPreferences) {
			res.status(200).json({ message: 'User preferences retrieved successfully', data: userPreferences });
		} else {
			res.status(404).json({ message: 'User preferences not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while fetching user preferences' });
	}
};

const updateUserPreference = async (req: Request, res: Response) => {
	try {
		const requestSchema = Joi.object({
			event_updates: Joi.boolean().required(),
			reminders: Joi.boolean().required(),
			networking_opportunities: Joi.boolean().required(),
			email_notifications: Joi.boolean().required(),
			push_notifications: Joi.boolean().required(),
		});

		const { error, value } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const userId = (req.user as User).id;

		const userPreference = await prisma.userPreference.create({
			data: {
				user_id: userId,
				event_update: value.event_updates,
				Reminders: value.reminders,
				networking_opportunities: value.networking_opportunities,
				email_notifications: value.email_notifications,
				push_notifications: value.push_notifications,
			},
		});

		return res.status(200).json({ message: 'User preference saved successfully', data: userPreference });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'An error occurred while saving user preference' });
	}
};

export { getUserPreference, updateUserPreference };
