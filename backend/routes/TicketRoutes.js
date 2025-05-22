import express from 'express';
import {
  createTicket,
  purchaseTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  resaleTicket,
  getResaleTickets,
  assignResaleTicketToWaitlistUser, // ✅ add this
} from '../controllers/TicketController.js';

import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Specific admin action routes should come first
router.post('/assign', authenticate, authorizeAdmin, assignResaleTicketToWaitlistUser);

router.post('/purchase', authenticate, purchaseTicket);
router.post('/resell', authenticate, resaleTicket);
router.get('/resale', authenticate, authorizeAdmin, getResaleTickets);

// Ticket CRUD
router.post('/', createTicket);
router.get('/', getAllTickets);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

router.get('/:id', getTicketById); 


export default router;
