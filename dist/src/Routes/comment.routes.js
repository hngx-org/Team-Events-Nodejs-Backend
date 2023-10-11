"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../Controllers/comment.controller");
const router = (0, express_1.Router)();
/*@POST /comment
 * This route should take care of creating a comment
 * PROTECTED ROUTE
 */
router.post('/', comment_controller_1.createComment);
/*@GET /comment/all/:eventId
 * This route should take care of getting all comments under a particular event
 * PROTECTED ROUTE
 */
router.get('/all/:eventId', comment_controller_1.getComments);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map