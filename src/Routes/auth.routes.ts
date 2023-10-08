import { Router } from 'express'
import { googleAuth, logout, twitterAuth } from '../Controllers/auth.controller'
const router = Router()

/*@Post /auth/google
 * This route should take care of login and signup
 */
router.post('/google', googleAuth)

/*@Post /auth/twitter
 *This route should take care of login and signup
 */
router.post('/twitter', twitterAuth)

/*@Post /auth/logout
 *This route should take care of login out(clearing the access tokens)
 */
router.post('/logout', logout)

export default router
