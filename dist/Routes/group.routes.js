"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("../Controllers/group.controller");
const router = (0, express_1.Router)();
/*@POST /group
 * This route should take care of creating groups(no page on the design for this but just use the information in the table)
 */
router.post('/', group_controller_1.createGroup);
/*@GET /group
 * This route should take care of getting all groups user is in
 */
router.get('/:id', group_controller_1.getUserGroups);
/*@GET /group/info/:groupId
 * This route should take care of getting a particular group
 */
router.get('/info/:groupId', group_controller_1.getGroupById);
/*@GET /group/event/:groupId
 * This route should take care of getting all events under groups
 */
router.get('/event/:groupId', group_controller_1.getGroupEvent);
exports.default = router;
//# sourceMappingURL=group.routes.js.map