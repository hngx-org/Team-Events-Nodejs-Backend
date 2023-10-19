"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_cloudinary_config_1 = __importDefault(require("../config/multer-cloudinary-config"));
const event_controller_1 = require("../Controllers/event.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
/*@POST /events
 * This route should take care of creating events should return a 201
 * PROTECTED ROUTE
 */
router.post('/', multer_cloudinary_config_1.default.single('image'), auth_middleware_1.default, event_controller_1.createEvent);
/*@GET /events
 * This route should take care of getting events created by all users
 * PROTECTED ROUTE
 */
router.get('/', event_controller_1.getAllEvents);
/*@GET /events/upcoming
 * PROTECTED ROUTE
 */
router.get('/upcoming', event_controller_1.getUpcomingEvents);
/*@GET /events/calendar
 * This route should take care of getting all events (calendar)
 * PROTECTED ROUTE
 */
router.get('/calendar', auth_middleware_1.default, event_controller_1.getEventsCalendar);
/*@GET /events/filter
 * This route should take care of filtering events
 * PROTECTED ROUTE
 */
router.get('/filter', event_controller_1.filterEvents);
/*@GET /events/register/:eventId
 * This route should take care of registering the user a particular event
 */
router.post('/register/:eventId', auth_middleware_1.default, event_controller_1.registerUserForEvent);
/*@GET /events/unregister/:eventId
 * This route should: Cancel user Registration to an event
 */
router.post('/unregister/:eventId', auth_middleware_1.default, event_controller_1.unregisterUserForEvent);
/*@GET /events/search?keyword=
 * This route should take care of the searching event by name
 */
router.get('/search', event_controller_1.eventSearch);
/*@GET /events/eventId
 * This route should take care of getting a particular event
 */
router.get('/:eventId', event_controller_1.getEventById);
/*@PUT /events/:id
 * This route should take care of updating events should return a 201
 * PROTECTED ROUTE
 */
router.put('/:eventId', multer_cloudinary_config_1.default.single('image'), auth_middleware_1.default, event_controller_1.updateEvent);
/*@DELETE /events/eventId
 * This route should take care of deleting a particular event
 */
router.delete('/:eventId', event_controller_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=event.routes.js.map