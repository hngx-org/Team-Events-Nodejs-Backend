import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
const prisma = new PrismaClient();

const createGroup = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;

		const requestSchema = Joi.object({
			group_name: Joi.string().required(),
			emails: Joi.array(),
		});

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { group_name, emails } = req.body;

		//const { secure_url } = await await cloudinary.uploader.upload(req.file.path);

		const newGroup = await prisma.group.create({
			data: {
				group_name,
				created_by: userId,
			},
		});

		if (emails && emails.length > 0) {
			const userGroupCreatePromises = emails.map(async (email: string) => {
				await prisma.userGroup.create({
					data: {
						user: { connect: { email } },
						group: { connect: { id: newGroup.id } },
					},
				});
			});

			// Wait for all userGroup.create promises to complete
			await Promise.all(userGroupCreatePromises);
		}

		res.status(201).json({
			statusCode: 201,
			message: 'Group created successfully',
			data: newGroup,
		});
	} catch (error) {
		console.error('Error creating group:', error);
		res.status(500).json({ error: 'An error occurred when creating the group' });
	}
};

const getUserGroups = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				user_group: {
					include: {
						group: true,
					},
				},
			},
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const userGroups = user.user_group.map((userGroup) => userGroup.group);

		res.status(200).json({
			message: 'User groups fetched successfully',
			userGroups,
		});
	} catch (error) {
		console.error('Error fetching user groups:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const getGroupById = (req: Request, res: Response) => {};

const getGroupEvent = async (req: Request, res: Response) => {
	const groupId = req.params.groupId;

	try {
		const groupEvents = await prisma.eventGroup.findMany({
			where: {
				group_id: groupId,
			},
			include: {
				event: true,
			},
		});

		if (groupEvents.length > 0) {
			const eventObjects = groupEvents.map((groupEvent) => ({
				...groupEvent.event,
				group_id: groupEvent.group_id,
			}));

			res.status(200).json({
				statusCode: 201,
				data: eventObjects,
			});
		} else {
			res.status(404).json({ error: 'No events found for this group' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while fetching group events.' });
	}
};

const addUserToGroup = (req: Request, res: Response) => {};

export { addUserToGroup, createGroup, getGroupById, getGroupEvent, getUserGroups };
