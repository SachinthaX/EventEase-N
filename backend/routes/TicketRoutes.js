// backend/routes/TicketRoutes.js

import express from 'express';
import { createTicket, purchaseTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, resaleTicket, getResaleTickets, } from '../controllers/TicketController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST request to create a new ticket
router.post('/', createTicket);

// Route to purchase ticket
router.post('/purchase', authenticate, purchaseTicket);

// GET request to get all tickets
router.get('/', getAllTickets);

// GET request to get a ticket by its ID
router.get('/:id', getTicketById);

// PUT request to update a ticket by its ID
router.put('/:id', updateTicket);

// DELETE request to delete a ticket by its ID
router.delete('/:id', deleteTicket);

router.post('/resell', authenticate, resaleTicket);

router.get("/resale", authenticate, authorizeAdmin, getResaleTickets);

router.get("/resale", authenticate, getResaleTickets);


export default router;
