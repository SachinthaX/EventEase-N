//frontend/src/services/ticketServices.jsx
import axios from 'axios';

export const getResaleTickets = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/tickets/resale');
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch resale tickets");
  }
};
