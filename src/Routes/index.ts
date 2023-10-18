import { Router } from 'express';
const router = Router();
import auth from './auth.routes';
import user from './user.routes';
import event from './event.routes';

/**
 * Main routes
 */
router.use('/auth', auth);
router.use('/user', user);
router.use('/events', event);

export default router;
