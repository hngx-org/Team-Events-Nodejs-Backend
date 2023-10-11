"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_cloudinary_config_1 = __importDefault(require("../config/multer-cloudinary-config"));
const event_controller_1 = require("../Controllers/event.controller");
const router = (0, express_1.Router)();
/*@POST /event
 * This route should take care of creating events should return a 201
 * PROTECTED ROUTE
 */
router.post('/', multer_cloudinary_config_1.default.single('image'), event_controller_1.createEvent);
/*@PUT /update-event/:id
 * This route should take care of updating events should return a 201
 * PROTECTED ROUTE
 */
router.put('/update-event/:id', multer_cloudinary_config_1.default.single('image'), event_controller_1.updateEvent);
/*@GET /event
 * This route should take care of getting events created by all users
 * PROTECTED ROUTE
 */
router.get('/', event_controller_1.getAllEvents);
/*@GET /event/friends
 * This route should take care of getting all events of members of shared groups
 * PROTECTED ROUTE
 */
router.get('/friends', event_controller_1.getFriendEvent);
/*@GET /event/search?keyword=
 * This route should take care of the searching event by name
 */
router.get('/search', event_controller_1.eventSearch);
/*@GET /event/info/eventId
 * This route should take care of getting a particular event
 */
router.get('/info/:eventId', event_controller_1.getEventById);
/*@DELETE /event/eventId
 * This route should take care of deleting a particular event
 */
router.delete('/:eventId', event_controller_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=event.routes.js.map