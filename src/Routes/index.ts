import { Router } from 'express';
const router = Router();
import auth from './auth.routes';
import event from './event.routes';
import group from './group.routes';
import comment from './comment.routes';

/**
 * Main routes
 */
router.use('/auth', auth);
router.use('/events', event);
router.use('/groups', group);
router.use('/comments', comment);

export default router;
