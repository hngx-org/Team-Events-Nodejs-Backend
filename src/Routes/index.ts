import { Router } from "express";
const router = Router()
import auth from './auth.routes'
import event from './event.routes'
import group from './group.routes'

/**
 * Main routes
 */
router.use('/auth', auth)
router.use('/event', event)
router.use('/group', group)


export default router