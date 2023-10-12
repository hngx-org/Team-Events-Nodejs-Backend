"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("../Controllers/group.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
/*@POST /group
 * This route should take care of creating groups(no page on the design for this but just use the information in the table)
 */
router.post('/', group_controller_1.createGroup);
/*@GET /group
 * This route should take care of getting all groups user is in
 */
router.get('/', auth_middleware_1.default, group_controller_1.getUserGroups);
/*@GET /group/info/:groupId
 * This route should take care of getting a particular group
 */
router.get('/info/:groupId', group_controller_1.getGroupById);
/*@GET /group/event/:groupId
 * This route should take care of getting all events under groups
 */
router.get('/event/:groupId', group_controller_1.getGroupEvent);
/*@POST /groups/:groupId/addUser
 * This route should take care of adding a user to a group using the user email address
 */
router.post('/:groupId/addUser', group_controller_1.addUserToGroup);
exports.default = router;
//# sourceMappingURL=group.routes.js.map