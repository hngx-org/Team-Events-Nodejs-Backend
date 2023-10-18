import { Router } from 'express';
import upload from '../config/multer-cloudinary-config';
import {
	createEvent,
	eventSearch,
	getAllEvents,
	getEventById,
	getFriendEvent,
	deleteEvent,
	updateEvent,
	getEventsCalendar,
	filterEvents,
} from '../Controllers/event.controller';
import protect from '../middleware/auth.middleware';
const router = Router();

/*@POST /events
 * This route should take care of creating events should return a 201
 * PROTECTED ROUTE
 */
router.post('/', upload.single('image'), protect, createEvent);

/*@GET /events
 * This route should take care of getting events created by all users
 * PROTECTED ROUTE
 */
router.get('/', getAllEvents);

/*@GET /events/friends
 * This route should take care of getting all events of members of shared groups
 * PROTECTED ROUTE
 */
router.get('/friends', protect, getFriendEvent);

/*@GET /events/calendar
 * This route should take care of getting all events (calendar)
 * PROTECTED ROUTE
 */
router.get('/calendar', protect, getEventsCalendar);

/*@GET /events/filter
 * This route should take care of filtering events
 * PROTECTED ROUTE
 */
router.get('/filter', filterEvents);

/*@GET /events/search?keyword=
 * This route should take care of the searching event by name
 */
router.get('/search', eventSearch);

/*@GET /events/info/eventId
 * This route should take care of getting a particular event
 */
router.get('/info/:eventId', getEventById);

/*@PUT /events/:id
 * This route should take care of updating events should return a 201
 * PROTECTED ROUTE
 */
router.put('/:eventId', upload.single('image'), protect, updateEvent);

/*@DELETE /events/eventId
 * This route should take care of deleting a particular event
 */
router.delete('/:eventId', deleteEvent);

export default router;
