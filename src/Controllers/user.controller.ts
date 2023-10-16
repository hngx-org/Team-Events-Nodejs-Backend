import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const getUserPreference = (req: Request, res: Response) => {
	res.status(200).json({ message: 'Still in development' });
};

const updateUserPreference = (req: Request, res: Response) => {
	res.status(200).json({ message: 'Still in development' });
};

export { getUserPreference, updateUserPreference };
