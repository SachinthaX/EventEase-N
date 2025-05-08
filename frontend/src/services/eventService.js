// src/services/eventService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // This is your API base
});

// ✅ Create Event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Error creating event');
  }
};

// ✅ Get All Events
export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Error fetching events');
  }
};

// ✅ Delete Event
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Error deleting event');
  }
};

// ✅ Update Event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Error updating event');
  }
};
