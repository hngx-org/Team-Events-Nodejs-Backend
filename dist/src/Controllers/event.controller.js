"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.unregisterUserForEvent = exports.registerUserForEvent = exports.getUpcomingEvents = exports.getCreatedEvents = exports.getEventsCalendar = exports.getEventById = exports.getAllEvents = exports.filterEvents = exports.eventSearch = exports.deleteEvent = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const prisma = new client_1.PrismaClient();
const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestSchema = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            startDate: joi_1.default.date().iso().required(),
            startTime: joi_1.default.any().required(),
            endDate: joi_1.default.date().iso().required(),
            endTime: joi_1.default.any().required(),
            tags: joi_1.default.array().items(joi_1.default.string()).required(),
            isPaidEvent: joi_1.default.boolean().required(),
            location: joi_1.default.string(),
            eventLink: joi_1.default.string(),
            ticketPrice: joi_1.default.number().when('isPaidEvent', {
                is: false,
                then: joi_1.default.number().valid(0.0),
                otherwise: joi_1.default.number().required(),
            }),
            numberOfAvailableTickets: joi_1.default.number().required(),
            registrationClosingDate: joi_1.default.date().iso().required(),
        });
        const { error, value } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        let uploadedImage = '';
        if (req.file) {
            // File upload (Cloudinary)
            const { secure_url } = await cloudinaryConfig_1.default.uploader.upload(req.file.path);
            uploadedImage = secure_url;
        }
        // Create the event
        const newEvent = await prisma.event.create({
            data: {
                name: value?.name,
                description: value?.description,
                image: uploadedImage,
                startTime: value?.startTime,
                endTime: value?.endTime,
                startDate: value?.startDate,
                endDate: value?.endDate,
                tags: value?.tags,
                isPaidEvent: value?.isPaidEvent,
                eventType: value?.location ? 'Physical' : 'Virtual',
                location: value?.location,
                eventLink: value?.eventLink,
                ticketPrice: value?.ticketPrice,
                numberOfAvailableTickets: value?.numberOfAvailableTickets,
                registrationClosingDate: value?.registrationClosingDate,
                organizer: {
                    connect: { id: userId },
                },
            },
        });
        // Respond with the created event
        res.status(201).json({
            statusCode: 201,
            message: 'Event created successfully',
            data: newEvent,
        });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const requestSchema = joi_1.default.object({
            eventId: joi_1.default.string().required(),
        });
        const { error: requestSchemaError, value: requestSchemaValue } = requestSchema.validate(req.params);
        if (requestSchemaError)
            return res.status(400).json({ error: requestSchemaError.details[0].message });
        const { eventId } = requestSchemaValue;
        const updateSchema = joi_1.default.object({
            name: joi_1.default.string(),
            description: joi_1.default.string(),
            startDate: joi_1.default.date().iso(),
            startTime: joi_1.default.any(),
            endDate: joi_1.default.date().iso(),
            endTime: joi_1.default.any(),
            tags: joi_1.default.array().items(joi_1.default.string()),
            isPaidEvent: joi_1.default.boolean(),
            location: joi_1.default.string(),
            eventLink: joi_1.default.string(),
            ticketPrice: joi_1.default.number().when('isPaidEvent', {
                is: false,
                then: joi_1.default.number().valid(0.0),
                otherwise: joi_1.default.number(),
            }),
            numberOfAvailableTickets: joi_1.default.number(),
            registrationClosingDate: joi_1.default.date().iso(),
        });
        const { error, value } = updateSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        // Fetch the existing event by ID
        const existingEvent = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const updatedEvent = await prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                name: value?.name || existingEvent.name,
                description: value?.description || existingEvent.description,
                startDate: value?.startDate || existingEvent.startDate,
                startTime: value?.startTime || existingEvent.startTime,
                endDate: value?.endDate || existingEvent.endDate,
                endTime: value?.endTime || existingEvent.endTime,
                tags: value?.tags || existingEvent.tags,
                isPaidEvent: value?.isPaidEvent || existingEvent.isPaidEvent,
                location: value?.location || existingEvent.location,
                eventLink: value?.eventLink || existingEvent.eventLink,
                eventType: value?.location ? 'Physical' : 'Virtual',
                ticketPrice: value?.ticketPrice || existingEvent.ticketPrice,
                numberOfAvailableTickets: value?.numberOfAvailableTickets || existingEvent.numberOfAvailableTickets,
                registrationClosingDate: value?.registrationClosingDate || existingEvent.registrationClosingDate,
            },
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Event updated successfully',
            data: updatedEvent,
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Error updating event' });
    }
};
exports.updateEvent = updateEvent;
const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        let message = 'Events retrieved successfully.';
        if (!events.length) {
            message = 'No events found';
        }
        res.status(200).json({ message, data: events });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};
exports.getAllEvents = getAllEvents;
const getCreatedEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const userEvents = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                event: true,
            },
        });
        if (!userEvents) {
            return res.status(404).json({ error: 'User not found' });
        }
        const createdEvents = userEvents.event;
        // Respond with the user's created events
        res.status(200).json({
            statusCode: 200,
            message: 'User events retrieved successfully',
            data: createdEvents,
        });
    }
    catch (error) {
        console.error('Error getting user events:', error);
        res.status(500).json({ error: 'Error getting user events' });
    }
};
exports.getCreatedEvents = getCreatedEvents;
const getEventsCalendar = async (req, res) => {
    // Get all events
    const events = await prisma.event.findMany();
    if (events.length > 0) {
        res.status(200).json(events);
    }
    else {
        res.status(404).json({ error: 'No events found' });
    }
};
exports.getEventsCalendar = getEventsCalendar;
const getUpcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        const limit = parseInt(req.query.limit) || 12;
        const upcomingEvents = await prisma.event.findMany({
            where: {
                startDate: { gte: today },
            },
            take: limit,
        });
        let message = 'Events retrieved successfully.';
        if (!upcomingEvents.length) {
            message = 'No events found';
        }
        res.status(200).json({ message, data: upcomingEvents });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
const filterEvents = async (req, res) => {
    try {
        const dateString = req.query.date;
        const eventPricing = req.query.eventPricing;
        // Parse the date string into a Date object
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        // Define a base query to retrieve events
        let eventsQuery = prisma.event.findMany({
            where: {
                startDate: { gte: date },
            },
        });
        // Execute the query and get the events as an array
        const allEvents = await eventsQuery;
        // Apply additional filters based on event pricing
        let filteredEvents = allEvents;
        if (eventPricing) {
            if (eventPricing === 'Free') {
                filteredEvents = allEvents.filter((event) => !event.isPaidEvent);
            }
            else if (eventPricing === 'Paid') {
                filteredEvents = allEvents.filter((event) => event.isPaidEvent);
            }
        }
        res.status(200).json({
            message: 'Events filtered successfully',
            data: filteredEvents,
        });
    }
    catch (error) {
        console.error('Error filtering events:', error);
        res.status(500).json({ error: 'An error occurred while filtering events' });
    }
};
exports.filterEvents = filterEvents;
const eventSearch = async (req, res) => {
    if (typeof req.query.keyword != 'string') {
        return res.status(400).json({
            error: 'invalid keyword value',
            message: 'keyword must be a string',
            statusCode: 400,
        });
    }
    let keyWord = req.query.keyword;
    try {
        const searchResults = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: keyWord,
                            mode: 'insensitive', // Perform case-insensitive search
                        },
                    },
                    {
                        description: {
                            contains: keyWord,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });
        return res.status(200).json({
            message: 'successful',
            data: searchResults,
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Something went wrong when trying to search for event',
            message: error.message,
            statusCode: 500,
        });
    }
};
exports.eventSearch = eventSearch;
const getEventById = async (req, res) => {
    const requestSchema = joi_1.default.object({
        eventId: joi_1.default.string().required(),
    });
    const { error } = requestSchema.validate(req.params);
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    const eventId = req.params.eventId;
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
        },
    });
    if (!event) {
        return res.status(404).json({
            statusCode: 404,
            message: 'Resource could not be found',
            error: 'Specified event does not exist',
        });
    }
    return res.status(200).json({
        data: event,
        statusCode: 200,
        message: 'success',
    });
};
exports.getEventById = getEventById;
const registerUserForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        const numberOfTickets = req.body?.numberOfTickets;
        // Check if the event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Check if the user is already registered for the event
        const existingRegistration = await prisma.userEvent.findFirst({
            where: { userId, eventId },
        });
        if (existingRegistration) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        // Create a new user event registration
        const registration = await prisma.userEvent.create({
            data: { userId, eventId },
        });
        res.status(201).json({
            message: 'User registered for the event successfully',
            data: { ...registration, numberOfTickets },
        });
    }
    catch (error) {
        console.error('Error registering user for the event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.registerUserForEvent = registerUserForEvent;
const unregisterUserForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        // Check if the event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Check if the user is registered for the event
        const existingRegistration = await prisma.userEvent.findFirst({
            where: { userId, eventId },
        });
        if (!existingRegistration) {
            return res.status(400).json({ error: 'User is not registered for this event' });
        }
        // Delete the user's registration for the event
        await prisma.userEvent.delete({
            where: {
                id: existingRegistration.id,
            },
        });
        res.status(200).json({ message: 'Your registration for this event has been canceled successfully.' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error canceling user registration for the event' });
    }
};
exports.unregisterUserForEvent = unregisterUserForEvent;
const deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params?.eventId;
        // Check if the event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if the current user is the organizer of the event
        if (event.organizerId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this event' });
        }
        // Delete the event
        await prisma.event.delete({
            where: { id: eventId },
        });
        // Manually clean up UserEvent records associated with the event
        await prisma.userEvent.deleteMany({
            where: { eventId: eventId },
        });
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting the event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.controller.js.map