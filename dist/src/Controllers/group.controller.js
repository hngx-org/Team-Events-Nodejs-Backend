"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGroups = exports.getGroupEvent = exports.getGroupById = exports.createGroup = exports.addUserToGroup = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const createGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestSchema = joi_1.default.object({
            group_name: joi_1.default.string().required(),
            emails: joi_1.default.array(),
        });
        const { error } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { group_name, emails } = req.body;
        //const { secure_url } = await await cloudinary.uploader.upload(req.file.path);
        const newGroup = await prisma.group.create({
            data: {
                group_name,
                created_by: userId,
            },
        });
        if (emails && emails.length > 0) {
            const userGroupCreatePromises = emails.map(async (email) => {
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
    }
    catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserGroups = getUserGroups;
const getGroupById = (req, res) => { };
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
        if (!req.body.email || typeof req.body.email !== "string") {
            return res.status(400).json({
                error: "Missing email field",
                message: "Field must contain a valid email",
                statusCode: 400
            });
        }
        const user = await prisma.user.findFirst({ where: {
                email: req.body.email
            } });
        if (!user) {
            return res.status(404).json({
                error: "User does not exist",
                message: "This user does not exist",
                statusCode: 404
            });
        }
        const group = await prisma.group.findUnique({
            where: {
                id: req.params.groupId
            }
        });
        if (!group) {
            return res.status(404).json({
                error: "Resource not found",
                statusCode: 404,
                message: "group does not exist"
            });
        }
        await prisma.userGroup.create({
            data: {
                user_id: user.id,
                group_id: req.params.groupId
            }
        });
        return res.status(200).json({
            message: "User added to group successfully",
            statusCode: 200
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "something went wrong",
            error: err.message
        });
    }
};
exports.addUserToGroup = addUserToGroup;
//# sourceMappingURL=group.controller.js.map