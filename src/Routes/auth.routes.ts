import { Router } from 'express'
import {
  callback,
  googleAuth,
  logout,
  twitterAuth,
  twitterAuthCallback
} from '../Controllers/auth.controller'
const router = Router()

/*@GET /auth/google
 * This route should take care of login and signup
 */
router.get('/google', googleAuth)
router.get('/callback', callback)

/*@Post /auth/twitter
 *This route should take care of login and signup
 */
router.post('/twitter', twitterAuth)
router.post('/callback', twitterAuthCallback)

/*@Post /auth/logout
 *This route should take care of login out(clearing the access tokens)
 */
router.post('/logout', logout)

export default router
