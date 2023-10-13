"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const createComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        const requestSchema = joi_1.default.object({
            comment: joi_1.default.string().required(),
        });
        const { error } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
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
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error creating comment' });
    }
};
exports.createComment = createComment;
const getComments = async (req, res) => {
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
        }
        else {
            res.status(404).json({ error: 'No comments found for this event' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching comments.' });
    }
};
exports.getComments = getComments;
//# sourceMappingURL=comment.controller.js.map