import { Router } from 'express';
import { createComment, getComments } from '../Controllers/comment.controller';
import protect from '../middleware/auth.middleware';
const router = Router();

/*@POST /comments/:eventId
 * This route should take care of creating a comment
 * PROTECTED ROUTE
 */
router.post('/:eventId', protect, createComment);

/*@GET /comments/:eventId
 * This route should take care of getting all comments under a particular event
 * PROTECTED ROUTE
 */
router.get('/:eventId', getComments);

export default router;
