"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToGroup = exports.getUserGroups = exports.getGroupEvent = exports.getGroupById = exports.createGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGroup = (req, res) => { };
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
const getGroupEvent = (req, res) => { };
exports.getGroupEvent = getGroupEvent;
const addUserToGroup = (req, res) => { };
exports.addUserToGroup = addUserToGroup;
//# sourceMappingURL=group.controller.js.map