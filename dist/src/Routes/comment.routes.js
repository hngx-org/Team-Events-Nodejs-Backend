"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../Controllers/comment.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
/*@POST /comments/:eventId
 * This route should take care of creating a comment
 * PROTECTED ROUTE
 */
router.post('/:eventId', auth_middleware_1.default, comment_controller_1.createComment);
/*@GET /comments/:eventId
 * This route should take care of getting all comments under a particular event
 * PROTECTED ROUTE
 */
router.get('/:eventId', comment_controller_1.getComments);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map