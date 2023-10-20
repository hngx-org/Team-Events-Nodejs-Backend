import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
import { hashPassword, verifyPassword } from '../utils/hashPassword';
import cloudinary from '../config/cloudinaryConfig';

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
			allow_others_see_profile: Joi.boolean().required(),
			event_details: Joi.boolean().required(),
			anyone_can_add_to_group: Joi.boolean().required(),
		});

		const { error, value } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const userId = (req.user as User).id;

		const isUserPreferenceExist = await prisma.userPreference.findFirst({
			where: {
				user_id: userId,
			},
		});

		let userPreference;

		if (!isUserPreferenceExist) {
			userPreference = await prisma.userPreference.create({
				data: {
					user_id: userId,
					event_update: value.event_updates,
					Reminders: value.reminders,
					networking_opportunities: value.networking_opportunities,
					email_notifications: value.email_notifications,
					push_notifications: value.push_notifications,
					allow_others_see_profile: value.allow_others_see_profile,
					event_details: value.event_details,
					anyone_can_add_to_group: value.anyone_can_add_to_group,
				},
			});
		} else {
			userPreference = await prisma.userPreference.update({
				where: {
					id: isUserPreferenceExist.id,
				},
				data: {
					event_update: value.event_updates,
					Reminders: value.reminders,
					networking_opportunities: value.networking_opportunities,
					email_notifications: value.email_notifications,
					push_notifications: value.push_notifications,
					allow_others_see_profile: value.allow_others_see_profile,
					event_details: value.event_details,
					anyone_can_add_to_group: value.anyone_can_add_to_group,
				},
			});
		}

		return res.status(200).json({ message: 'User preference saved successfully', data: userPreference });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'An error occurred while saving user preference' });
	}
};

const changePassword = async (req: Request, res: Response) => {
	try {
		const email = (req.user as User).email;

		const passwordSchema = Joi.object({
			currentPassword: Joi.string().min(8).required(),
			newPassword: Joi.string().min(8).required(),
			confirmNewPassword: Joi.ref('newPassword'),
		}).with('newPassword', 'confirmNewPassword');

		const { error, value } = passwordSchema.validate(req.body);

		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user) {
			return res.status(400).json({ error: `user not found`, success: false });
		}

		const isPasswordMatch = await verifyPassword(value.currentPassword, user.password);

		if (!isPasswordMatch) {
			return res.status(400).json({
				error: `Current password is incorrect`,
				success: false,
			});
		}

		const hashedPassword = await hashPassword(value.newPassword);

		const updatedUser = await prisma.user.update({
			where: {
				email: email,
			},
			data: {
				password: hashedPassword,
			},
		});

		if (!updatedUser) {
			return res.status(400).json({
				status: `error`,
				message: `password failed to update`,
				success: false,
			});
		}

		res.status(200).json({
			status: `success`,
			message: `password successfully updated`,
			success: true,
			data: {
				id: updatedUser.id,
				email: updatedUser.email,
				username: updatedUser.username,
				firstname: updatedUser.firstname,
				lastname: updatedUser.lastname,
				avatar: updatedUser.avatar,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: `error`,
			message: `internet error`,
			success: false,
		});
	}
};

const updateUserProfile = async (req: Request, res: Response) => {
	try {
		const email = (req.user as User).email;

		const profileSchema = Joi.object({
			firstname: Joi.string(),
			lastname: Joi.string(),
			phonenumber: Joi.string(),
		});

		const { error, value } = profileSchema.validate(req.body);

		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const user = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		if (!user) return res.status(400).json({ error: `User not found` });

		let uploadedImage = '';
		if (req.file) {
			// File upload (Cloudinary)
			const { secure_url } = await cloudinary.uploader.upload(req.file.path);
			uploadedImage = secure_url;
		}

		const updatedUser = await prisma.user.update({
			where: { email: email },
			data: {
				firstname: value.firstname,
				lastname: value.lastname,
				phone_no: value.phonenumber,
				avatar: uploadedImage,
			},
		});

		res.status(200).json({
			message: `Profile updated successfully `,
			success: true,
			data: {
				id: updatedUser.id,
				email: updatedUser.email,
				username: updatedUser.username,
				firstname: updatedUser.firstname,
				lastname: updatedUser.lastname,
				avatar: updatedUser.avatar,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: `internet error`,
			success: false,
		});
	}
};

const getUserRegisteredEvents = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) return res.status(400).json({ error: `User not found` });

		const userEvents = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				event: true,
			},
		});

		if (!userEvents) {
			return res.status(404).json({ error: 'User or Event not found' });
		}

		const userRegisteredEvents = userEvents.event;

		// Respond with the user's created events
		res.status(200).json({
			statusCode: 200,
			message: 'User events retrieved successfully',
			data: userRegisteredEvents,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: `internet error`,
			success: false,
		});
	}
};

export {
	getUserPreference,
	updateUserPreference,
	changePassword,
	updateUserProfile,
	getUserRegisteredEvents,
};
