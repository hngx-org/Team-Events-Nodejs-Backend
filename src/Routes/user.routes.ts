import { Router } from 'express';
import protect from '../middleware/auth.middleware';
import upload from '../config/multer-cloudinary-config';
import { changePassword, getUserPreference, updateUserPreference, updateUserProfile } from '../Controllers/user.controller';
const router = Router();

/*@GET /user/
 * This route should
 */
router.get('/settings', protect, getUserPreference);

/*@POST /groups
 * This route should
 */
router.post('/settings', protect, updateUserPreference);

/*@PATCH /groups
 * This route should
 */
router.patch('/change-password', protect, changePassword)

/*@PATCH /groups
 * This route should
 */
router.patch('/update-profile',  upload.single('image'), protect, updateUserProfile);


export default router;
