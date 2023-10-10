import { Router } from 'express'
import {
  createGroup,
  getGroupById,
  getGroupEvent,
  getUserGroups,
} from '../Controllers/group.controller'
const router = Router()

/*@POST /group
 * This route should take care of creating groups(no page on the design for this but just use the information in the table)
 */
router.post('/', createGroup)

/*@GET /group
 * This route should take care of getting all groups user is in
 */

router.get('/:id', getUserGroups)

/*@GET /group/info/:groupId
 * This route should take care of getting a particular group
 */
router.get('/info/:groupId', getGroupById)

/*@GET /group/event/:groupId
 * This route should take care of getting all events under groups
 */
router.get('/event/:groupId', getGroupEvent)

export default router
