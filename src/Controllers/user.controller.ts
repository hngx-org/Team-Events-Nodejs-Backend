import { PrismaClient, User, UserPreference } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
const prisma = new PrismaClient();

const getUserPreference = async (req: Request, res: Response) => {
	try {
		const userPreferenceDetails = await prisma.userPreference.findMany();
		if (userPreferenceDetails.length !== 0) {
			return res.status(200).json({
				status: 'success',
				message: 'Users preference data',
				data: userPreferenceDetails,
			});
		}
		res.status(404).json({
			status: 'error',
			message: 'User preference data not found',
			error: true,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Internet error',
			error: true,
		});
	}
};

const getUserPreferenceByUserId = async (req: Request, res: Response) => {
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

const createUserPreference = async (req: Request, res: Response) => {
	try {
		const user_id = (req.user as User).id;

		const requestSchema = Joi.object({
			event_update: Joi.boolean(),
			reminders: Joi.boolean(),
			networking_opportunities: Joi.boolean(),
			email_notifications: Joi.boolean(),
			push_notifications: Joi.boolean(),
			allow_others_see_profile: Joi.boolean(),
			event_details: Joi.boolean(),
			anyone_can_add_to_group: Joi.boolean(),
		});

		const { error, value } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const isExisting = await prisma.user.findUnique({ where: { id: user_id } });

		if (!isExisting) {
			return res.status(404).json({
				error: 'User not found',
			});
		}

		const isMatch = await prisma.userPreference.findFirst({ where: { user_id: user_id } });

		if (isMatch) {
			return res.status(404).json({
				error: 'User Preference already exist',
			});
		}

		const userPreferenceDetail = await prisma.userPreference.create({
			data: {
				user_id: user_id,
				event_update: value.event_update,
				Reminders: value.reminders,
				networking_opportunities: value.networking_opportunities,
				email_notifications: value.email_notifications,
				push_notifications: value.push_notifications,
				allow_others_see_profile: value.allow_others_see_profile,
				event_details: value.event_details,
				anyone_can_add_to_group: value.anyone_can_add_to_group,
			},
		});

		if (!userPreferenceDetail) {
			res.status(400).json({
				statusCode: 400,
				message: 'User preferences not created',
				error: true,
			});
		}

		res.status(200).json({
			statusCode: 200,
			message: 'User preferences created successfully',
			data: userPreferenceDetail,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'error',
			message: 'Internet error',
			error: true,
		});
	}
};

export { getUserPreference, getUserPreferenceByUserId, updateUserPreference, createUserPreference };
