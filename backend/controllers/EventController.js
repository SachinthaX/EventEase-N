// controllers/EventController.js

import Event from '../models/EventModel.js';

// Create an event
export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      tickets,
      prices,
      eventImage,
      imageUrl,
    } = req.body;

    

    // Create a new Event document based on the provided fields
    const newEvent = new Event({
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      tickets,
      prices,
      eventImage,
      imageUrl,
      
    });

    // Save the event to the database
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event.', error });
  }
};


// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events.', error });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event by ID.', error });
  }
};

// Update event details
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      tickets,
      prices,
      eventImage,
      imageUrl,
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Update the event fields
    event.eventName = eventName || event.eventName;
    event.eventDescription = eventDescription || event.eventDescription;
    event.eventDate = eventDate || event.eventDate;
    event.eventTime = eventTime || event.eventTime;
    event.eventLocation = eventLocation || event.eventLocation;
    event.tickets = tickets || event.tickets;
    event.prices = prices || event.prices;
    event.eventImage = eventImage || event.eventImage;

    await event.save();
    res.status(200).json({ message: 'Event updated successfully!', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event.', error });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    await Event.findByIdAndDelete(id); // ✅ Safe for all Mongoose versions
    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    res.status(500).json({ message: 'Error deleting event.', error: error.message });
  }
};

