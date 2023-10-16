"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGroups = exports.getGroupEvent = exports.getGroupById = exports.createGroup = exports.addUserToGroup = void 0;
const client_1 = require("@prisma/client");
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const createGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestSchema = joi_1.default.object({
            group_name: joi_1.default.string().required(),
            emails: joi_1.default.any(),
        });
        const { error } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        let uploadedImage = '';
        if (req.file) {
            // File upload (cloudinary)
            const { secure_url } = await cloudinaryConfig_1.default.uploader.upload(req.file.path);
            uploadedImage = secure_url;
        }
        const { group_name, emails } = req.body;
        const newGroup = await prisma.group.create({
            data: {
                group_name,
                created_by: userId,
                image: uploadedImage,
            },
        });
        const emailArray = Array.isArray(emails) ? emails : JSON.parse(emails);
        if (emailArray && emailArray.length > 0) {
            const userGroupCreatePromises = emailArray.map(async (email) => {
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
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'An error occurred when creating the group' });
    }
};
exports.createGroup = createGroup;
const getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                user_group: {
                    include: {
                        group: {
                            include: {
                                event_group: true, // Include events for each group
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userGroups = user.user_group.map((userGroup) => {
            const group = userGroup.group;
            // Count the number of events for each group
            const numEvents = group.event_group.length;
            return { ...group, numEvents };
        });
        res.status(200).json(userGroups);
    }
    catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserGroups = getUserGroups;
const getGroupById = async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                user_groups: {
                    select: {
                        user_id: true,
                    },
                },
            },
        });
        if (group) {
            // Count the number of users/members in the group
            const numberOfMembers = group.user_groups.length;
            res.status(200).json({
                statusCode: 200,
                data: { ...group, numberOfMembers },
            });
        }
        else {
            res.status(404).json({ error: 'Group not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the group.' });
    }
};
exports.getGroupById = getGroupById;
const getGroupEvent = async (req, res) => {
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
        }
        else {
            res.status(404).json({ error: 'No events found for this group' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching group events.' });
    }
};
exports.getGroupEvent = getGroupEvent;
const addUserToGroup = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
        });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        // Check if the user exists
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Check if the group exists
        const group = await prisma.group.findUnique({
            where: {
                id: req.params.groupId,
            },
        });
        if (!group)
            return res.status(404).json({ error: 'Group not found' });
        // Check if the user is already in the group
        const existingUserGroup = await prisma.userGroup.findFirst({
            where: {
                user_id: user.id,
                group_id: req.params.groupId,
            },
        });
        if (existingUserGroup)
            return res.status(400).json({ error: 'User is already a member of the group' });
        // If the user is not already in the group, add them
        await prisma.userGroup.create({
            data: {
                user_id: user.id,
                group_id: req.params.groupId,
            },
        });
        return res.status(200).json({
            message: 'User added to the group successfully',
            statusCode: 200,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding user to group' });
    }
};
exports.addUserToGroup = addUserToGroup;
//# sourceMappingURL=group.controller.js.map