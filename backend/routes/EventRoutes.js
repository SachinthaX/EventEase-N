//routes/EventRoutes.js

import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/EventController.js';


const router = express.Router();

// Create a new event
router.post("/", createEvent);

// Get all events
router.get("/", getAllEvents);

// Get an event by ID
router.get("/:id", getEventById);

// Update event
router.put("/:id", updateEvent);

// Delete event
router.delete("/:id", deleteEvent);



export default router;
