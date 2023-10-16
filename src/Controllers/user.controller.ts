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
	try {
		const user_id = (req.user as User).id;

		const userPreferenceData: UserPreference = await prisma.userPreference.findFirst({
			where: {
				user_id: user_id,
			},
		});

		if (!userPreferenceData) {
			res.status(404).json({
				status: 'error',
				message: 'User preference data not found',
				error: true,
			});
		}

		res.status(200).json({
			status: 'success',
			message: 'Users preference data',
			data: userPreferenceData,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Internet error',
			error: true,
		});
	}
};

const createUserPreference = async (req: Request, res: Response) => {
	try {
		const user_id = (req.user as User).id;

		const {
			event_update,
			reminders,
			networking_opportunities,
			email_notifications,
			push_notifications,
			allow_others_see_profile,
			event_details,
			anyone_can_add_to_group,
		} = req.body;

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

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const isExisting = await prisma.user.findUnique({ where: { id: user_id } });

		if (!isExisting) {
			return res.status(404).json({
				error: 'User not found',
			});
		}

		const userPreferenceDetail = await prisma.userPreference.create({
			data: {
				user_id: user_id,
				event_update: event_update,
				Reminders: reminders,
				networking_opportunities: networking_opportunities,
				email_notifications: email_notifications,
				push_notifications: push_notifications,
				allow_others_see_profile: allow_others_see_profile,
				event_details: event_details,
				anyone_can_add_to_group: anyone_can_add_to_group,
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

const updateUserPreference = async (req: Request, res: Response) => {
	try {
		const user_id = (req.user as User).id;

		const {
			event_update,
			reminders,
			networking_opportunities,
			email_notifications,
			push_notifications,
			allow_others_see_profile,
			event_details,
			anyone_can_add_to_group,
		} = req.body;

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

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const isExisting = await prisma.user.findUnique({ where: { id: user_id } });

		if (!isExisting) {
			return res.status(404).json({
				error: 'User not found',
			});
		}

		const userPreferenceData = await prisma.userPreference.findFirst({
			where: {
				user_id: user_id,
			},
		});

		const userPreferenceDetail = await prisma.userPreference.update({
			where: {
				id: userPreferenceData.id,
			},

			data: {
				event_update: event_update,
				Reminders: reminders,
				networking_opportunities: networking_opportunities,
				email_notifications: email_notifications,
				push_notifications: push_notifications,
				allow_others_see_profile: allow_others_see_profile,
				event_details: event_details,
				anyone_can_add_to_group: anyone_can_add_to_group,
			},
		});

		if (!userPreferenceDetail) {
			res.status(400).json({
				statusCode: 400,
				message: 'User preferences not updated',
				error: true,
			});
		}

		res.status(200).json({
			statusCode: 200,
			message: 'User preferences updated successfully',
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
