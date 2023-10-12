import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinaryConfig';
const prisma = new PrismaClient();

const createGroup = async (req: Request, res: Response) => {
	try {
		const { group_name, created_by, emails } = req.body;

		//const { secure_url } = await await cloudinary.uploader.upload(req.file.path);

		const newGroup = await prisma.group.create({
			data: {
				group_name,
				created_by
			},
		});

		if (emails && emails.length > 0) {
			for (const email of emails) {
				await prisma.userGroup.create({
					data: {
						user: { connect: { email } },
						group: { connect: { id: newGroup.id } },
					},
				});
			}
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

const getGroupEvent = (req: Request, res: Response) => {};

const addUserToGroup = (req: Request, res: Response) => {};

export { addUserToGroup, createGroup, getGroupById, getGroupEvent, getUserGroups };
