import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
const prisma = new PrismaClient();

const createComment = async (req: Request, res: Response) => {
	try {
		const userId = (req.user as User).id;
		const eventId = req.params.eventId;

		const requestSchema = Joi.object({
			comment: Joi.string().required(),
		});

		const { error } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { comment } = req.body;

		const newComment = await prisma.comment.create({
			data: {
				event_id: eventId,
				created_by: userId,
				comment,
			},
		});

		res.status(201).json({
			statusCode: 201,
			message: 'Comment created successfully',
			data: newComment,
		});
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ error: 'Error creating comment' });
	}
};

const getComments = async (req: Request, res: Response) => {
	const eventId = req.params.eventId;

	try {
		const comments = await prisma.comment.findMany({
			where: {
				event_id: eventId,
			},
		});

		if (comments.length > 0) {
			res.status(200).json({
				statusCode: 200,
				data: comments,
			});
		} else {
			res.status(404).json({ error: 'No comments found for this event' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while fetching comments.' });
	}
};

export { createComment, getComments };
