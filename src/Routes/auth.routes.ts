import { Router } from 'express';
import {
	callback,
	googleAuth,
	logout,
	twitterAuth,
	twitterAuthCallback,
} from '../Controllers/auth.controller';
const router = Router();

/*@GET /auth/google
 * This route should take care of login and signup
 */
router.get('/google', googleAuth);
router.post('/callback', callback);

/*@Post /auth/twitter
 *This route should take care of login and signup
 */
router.get('/twitter', twitterAuth);
router.get('/twitter/callback', twitterAuthCallback);

/*@Post /auth/logout
 *This route should take care of login out(clearing the access tokens)
 */
router.post('/logout', logout);

export default router;
