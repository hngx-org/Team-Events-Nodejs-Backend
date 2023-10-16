import { Router } from 'express';
import protect from '../middleware/auth.middleware';
import { createUserPreference, getUserPreference, getUserPreferenceByUserId, updateUserPreference } from '../Controllers/user.controller';
const router = Router();

/*@GET settings/users/
 * This route should get all user preference
 */
router.get('/settings/users', protect, getUserPreference);

/*@GET settings/users/{id}
 * This route should get a user preference
 */
router.get('/settings/users/:id', protect, getUserPreferenceByUserId);

/*@PUT /groups
 * This route should update a user preference
 */
router.put('/settings/update', protect, updateUserPreference);

/*@POST/groups
 * This route should create a user preference
 */
router.post('/settings', protect, createUserPreference);

export default router;
