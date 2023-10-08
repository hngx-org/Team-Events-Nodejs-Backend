"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.getEventById = exports.eventSearch = exports.getFriendEvent = exports.getAllEvents = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createEvent = async (req, res) => {
    const { originalname, mimetype, size, path } = req.file;
    const imageUploadResponse = {
        secure_url: req.file.path
    };
    try {
        const { created_by, event_name, event_description, 
        // image,
        event_start, event_end, location, } = req.body;
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
    }
    catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createEvent = createEvent;
const getAllEvents = async (req, res) => {
    // Get all events
    const events = await prisma.event.findMany();
    if (events.length > 0) {
        res.status(200).json(events);
    }
    else {
        res.status(404).json({ error: 'No events found' });
    }
};
exports.getAllEvents = getAllEvents;
const getFriendEvent = async (req, res) => {
    try {
        const userId = '5c8e1b9f-c7f1-4578-bd6e-923832bdb903'; // Get the user ID from the request [req.user.id]
        // Find all groups that the user belongs to
        const userGroups = await prisma.userGroup.findMany({
            where: {
                user_id: userId,
            },
            select: {
                group_id: true,
            },
        });
        // Find all events that belong to the groups that the user belongs to
        const groupIds = userGroups.map((userGroup) => userGroup.group_id);
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
        });
        if (friendEvents.length > 0) {
            res.json(friendEvents);
        }
        else {
            res.json({ error: 'No events found' });
        }
    }
    catch (error) {
        console.error('Error fetching friend events:', error);
        res.status(500).json({ error: 'Error fetching friend events' });
    }
};
exports.getFriendEvent = getFriendEvent;
const eventSearch = async (req, res) => {
    if (typeof req.query.keyword != "string") {
        return res.status(400).json({
            error: "invalid keyword value",
            message: "keyword must be a string",
            statusCode: 400
        });
    }
    const keyWord = req.query.keyword;
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
        });
        if (searchResults.length === 0) {
            return res.status(404).json({
                error: "A match could not be  found",
                message: "No match was found",
                statusCode: 404
            });
        }
        return res.status(200).json({
            statusCode: 200,
            message: "successful",
            data: searchResults
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Something went wrong when trying to search for event",
            message: error.message,
            statusCode: 500
        });
    }
};
exports.eventSearch = eventSearch;
const getEventById = async (req, res) => {
    const eventId = req.params.eventId;
    const event = await prisma.event.findFirst({
        where: {
            id: eventId
        }
    });
    if (!event) {
        return res.status(404).json({
            statusCode: 404,
            message: "Resource could not be found",
            error: "Specified event does not exist"
        });
    }
    return res.status(200).json({
        data: event,
        statusCode: 200,
        message: "success"
    });
};
exports.getEventById = getEventById;
const deleteEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        return res.status(404).json({ message: 'Event not found' });
    // Delete event from database
    await prisma.event.delete({ where: { id: eventId } });
    // TODO: Delete image from cloudinary
    res.status(200).json({ message: 'Event deleted successfully' });
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.controller.js.map