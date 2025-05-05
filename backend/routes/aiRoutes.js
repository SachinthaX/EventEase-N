// backend/routes/aiRoutes.js

import express from 'express';
import { aiResponseHandler } from '../controllers/aiController.js';

const router = express.Router();

// No token required
router.post('/chat', aiResponseHandler);

export default router;
