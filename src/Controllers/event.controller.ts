import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

const createEvent = async(req: Request, res: Response) => {
  const { originalname, mimetype, size, path } = req.file;
 
  const imageUploadResponse = {
    secure_url: req.file.path
  };
  try {
    const {
      created_by,
      event_name,
      event_description,
      // image,
      event_start,
      event_end,
      location,
    } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        created_by,
        event_name,
        event_description,
        image: imageUploadResponse.secure_url,
        event_start,
        event_end,
        location,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
  
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllEvents = (req: Request, res: Response) => {}

const getFriendEvent = (req: Request, res: Response) => {}

const eventSearch = (req: Request, res: Response) => {}

const getEventById = (req: Request, res: Response) => {}

export { createEvent, getAllEvents, getFriendEvent, eventSearch, getEventById }
