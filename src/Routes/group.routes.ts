import { Router } from 'express';
import {
	createGroup,
	getGroupById,
	getGroupEvent,
	getUserGroups,
	addUserToGroup,
} from '../Controllers/group.controller';
import protect from '../middleware/auth.middleware';
import upload from '../config/multer-cloudinary-config';
const router = Router();

/*@POST /group
 * This route should take care of creating groups(no page on the design for this but just use the information in the table)
 */
router.post('/',upload.single('image'), createGroup);

/*@GET /group
 * This route should take care of getting all groups user is in
 */
router.get('/', protect, getUserGroups);

/*@GET /group/info/:groupId
 * This route should take care of getting a particular group
 */
router.get('/info/:groupId', getGroupById);

/*@GET /group/event/:groupId
 * This route should take care of getting all events under groups
 */
router.get('/event/:groupId', getGroupEvent);

/*@POST /groups/:groupId/addUser
 * This route should take care of adding a user to a group using the user email address
 */
router.post('/:groupId/addUser', addUserToGroup);

export default router;
