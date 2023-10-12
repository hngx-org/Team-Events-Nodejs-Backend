import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();


const createGroup = (req: Request, res: Response) => {};

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

const addUserToGroup = async (req: Request, res: Response) => {
	try {
		type groupVar = { id: string; user_id: string; group_id: string; }
		
		const group: groupVar = await prisma.userGroup.findUnique({
			where:{
				id: req.params.groupId
			}
		});

		if (!group) {
			return res.status(404).json({
			error: "Resource not found",
			statusCode: 404,
			message: "group does not exist"
		})
	}
		await prisma.userGroup.create({
			data:{
				user_id: req.user.id,
				group_id: req.params.groupId

			}
		})
		return res.status(200).json({
			message: "User added to group successfully",
			statusCode: 200
		})

	} catch(err){
		res.status(500).json({
			message: "something went wrong",
			error: err.message
		})
	}
};

export { createGroup, getGroupById, getGroupEvent, getUserGroups, addUserToGroup };
