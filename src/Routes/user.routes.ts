import { Router } from 'express';
import protect from '../middleware/auth.middleware';
import { getUserPreference, updateUserPreference } from '../Controllers/user.controller';
const router = Router();

/*@GET /user/
 * This route should
 */
router.get('/settings', protect, getUserPreference);

/*@POST /groups
 * This route should
 */
router.post('/settings', protect, updateUserPreference);

export default router;
