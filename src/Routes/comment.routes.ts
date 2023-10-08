import { Router } from 'express'
import { createComment, getComments } from '../Controllers/comment.controller'
const router = Router()

/*@POST /comment
 * This route should take care of creating a comment
 * PROTECTED ROUTE
 */
router.post('/', createComment)

/*@GET /comment/all/:eventId
 * This route should take care of getting all comments under a particular event
 * PROTECTED ROUTE
 */
router.get('/all/:eventId', getComments)
export default router
