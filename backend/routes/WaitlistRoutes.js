//routes/WaitlistRoutes.js

import express from 'express';
import { 
    joinWaitlist, 
    getWaitlistByEvent , 
    getUserWaitlist,
} from '../controllers/WaitlistController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/join', authenticate, joinWaitlist);
router.get('/user', authenticate, getUserWaitlist);
router.get('/:eventId', authenticate, authorizeAdmin, getWaitlistByEvent);

export default router;
