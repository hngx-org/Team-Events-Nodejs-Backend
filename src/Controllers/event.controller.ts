import { Event, PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()
import cloudinary from '../config/cloudinaryConfig'

const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      created_by,
      event_name,
      event_description,
      event_start,
      event_end,
      location,
    } = req.body

    const { secure_url } = await cloudinary.uploader.upload(req.file.path)

    const newEvent: Event = await prisma.event.create({
      data: {
        created_by,
        event_name,
        event_description,
        image: secure_url,
        event_start,
        event_end,
        location,
      },
    })

    res.status(201).json({
      statusCode: 201,
      message: 'Event created successfully',
      data: newEvent,
    })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

//update event
const updateEvent = async (req: Request, res: Response) => {
  try {
    const {
      created_by,
      event_name,
      event_description,
      event_start,
      event_end,
      location,
    } = req.body
    
    let secure_url;
    
    try{
      const { secure_url: uploadURL } = await cloudinary.uploader.upload(req.file.path);
      secure_url = uploadURL;
    }
    catch(error){
      console.log(error);
    }
    const updateEvent: Event = await prisma.event.update({
      where:{
        id: req.params.eventId,
      },
      data: {
        created_by,
        event_name,
        event_description,
        image: secure_url,
        event_start,
        event_end,
        location,
      },
    })

    res.status(201).json({
      statusCode: 201,
      message: 'Event updated successfully',
      data: updateEvent,
    })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getAllEvents = async (req: Request, res: Response) => {
  // Get all events
  const events = await prisma.event.findMany()
  if (events.length > 0) {
    res.status(200).json(events)
  } else {
    res.status(404).json({ error: 'No events found' })
  }
}

const getFriendEvent = async (req: Request, res: Response) => {
  try {
    const userId = '5c8e1b9f-c7f1-4578-bd6e-923832bdb903' // Get the user ID from the request [req.user.id]

    // Find all groups that the user belongs to
    const userGroups = await prisma.userGroup.findMany({
      where: {
        user_id: userId,
      },
      select: {
        group_id: true,
      },
    })

    // Find all events that belong to the groups that the user belongs to
    const groupIds = userGroups.map((userGroup) => userGroup.group_id)
    const friendEvents = await prisma.event.findMany({
      where: {
        event_group: {
          some: {
            group_id: {
              in: groupIds,
            },
          },
        },
      },
    })

    if (friendEvents.length > 0) {
      res.json(friendEvents)
    } else {
      res.json({ error: 'No events found' })
    }
  } catch (error) {
    console.error('Error fetching friend events:', error)
    res.status(500).json({ error: 'Error fetching friend events' })
  }
}

const eventSearch = async (req: Request, res: Response) => {
  if (typeof req.query.keyword != 'string') {
    return res.status(400).json({
      error: 'invalid keyword value',
      message: 'keyword must be a string',
      statusCode: 400,
    })
  }
  const keyWord: string = req.query.keyword
  try {
    const searchResults = await prisma.event.findMany({
      where: {
        OR: [
          {
            event_name: {
              contains: keyWord,
              mode: 'insensitive', // Perform case-insensitive search
            },
          },
          {
            event_description: {
              contains: keyWord,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    if (searchResults.length === 0) {
      return res.status(404).json({
        error: 'A match could not be  found',
        message: 'No match was found',
        statusCode: 404,
      })
    }
    return res.status(200).json({
      statusCode: 200,
      message: 'successful',
      data: searchResults,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Something went wrong when trying to search for event',
      message: error.message,
      statusCode: 500,
    })
  }
}

const getEventById = async (req: Request, res: Response) => {
  const eventId: string = req.params.eventId
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  })
  if (!event) {
    return res.status(404).json({
      statusCode: 404,
      message: 'Resource could not be found',
      error: 'Specified event does not exist',
    })
  }
  return res.status(200).json({
    data: event,
    statusCode: 200,
    message: 'success',
  })
}

const deleteEvent = async (req: Request, res: Response) => {
  const eventId = req.params.eventId
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) return res.status(404).json({ message: 'Event not found' })
  // Delete event from database
  await prisma.event.delete({ where: { id: eventId } })
  // TODO: Delete image from cloudinary
  res.status(200).json({ message: 'Event deleted successfully' })
}

export {
  createEvent,
  getAllEvents,
  getFriendEvent,
  eventSearch,
  getEventById,
  deleteEvent,
  updateEvent,
}
