//controllers/TicketController.js

import asyncHandler from 'express-async-handler';

import Ticket from '../models/TicketModel.js'; 
import Waitlist from '../models/WaitlistModel.js';  
import Wallet from '../models/WalletModel.js';  
import User from '../models/User.js';
import Event from '../models/EventModel.js';

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { eventId, userId, resalePrice, status, seatNumber, ticketPrice, eventDate, userName } = req.body;

    // Ensure all required fields are provided
    if (!seatNumber || !ticketPrice || !eventDate || !userName || !eventId || !userId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Generate a unique ticket number (if needed, manually or using a logic)
    const ticketNumber = Math.floor(Math.random() * 1000000); // Example random number

    const newTicket = new Ticket({
      event: eventId,
      userId,
      resalePrice,
      status,
      seatNumber,
      ticketPrice,
      category,
      eventDate,
      userName,
      ticketNumber, 
      resaleStatus: 'not_listed',
    });

    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully!', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating ticket.', error });
  }
};




// Purchase a new ticket
export const purchaseTicket = async (req, res) => {
  const { eventId, eventDate, event, ticketPrice, seatNumber, paymentMethod, quantity, category } = req.body;

  try {
    console.log("💬 Incoming Purchase Request:", req.body);
    console.log("👤 Authenticated User:", req.user);

    const user = await User.findById(req.user.id);
    const event = await Event.findById(eventId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if enough tickets are available
    if (event.tickets[category] < quantity) {
      return res.status(400).json({ message: `Only ${event.tickets[category]} ${category} tickets available` });
    }

    const totalCost = ticketPrice * quantity;

    if (paymentMethod === 'wallet') {
      if (user.wallet < totalCost) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.wallet -= totalCost;
    } else if (paymentMethod === 'card') {
      console.log("💳 Simulating card payment success");
      // simulate card payment – no wallet deduction
    } else {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const purchasedTickets = [];

    for (let i = 0; i < quantity; i++) {
      const ticket = new Ticket({
        userId: user._id,
        userName: user.name,
        event: eventId,
        eventDate,
        ticketPrice,
        seatNumber: `${category}-${Math.floor(Math.random() * 1000)}`,
        category,
      });

      await ticket.save();
      user.tickets.push(ticket._id);
      purchasedTickets.push(ticket);
    }

    // ✅ Reduce ticket count in event
    event.tickets[category] -= quantity;

    await user.save();
    await event.save();

    res.json({
      message: `${quantity} ticket(s) purchased successfully`,
      tickets: purchasedTickets,
    });

  } catch (error) {
    console.error("❌ Ticket Purchase Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



      



// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tickets.', error });
  }
};

// Get a ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching ticket by ID.', error });
  }
};


// Update ticket details
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resalePrice } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    ticket.status = status || ticket.status;
    ticket.resalePrice = resalePrice || ticket.resalePrice;

    await ticket.save();
    res.status(200).json({ message: 'Ticket updated successfully!', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating ticket.', error });
  }
};

// Delete a ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    await ticket.remove();
    res.status(200).json({ message: 'Ticket deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting ticket.', error });
  }
};



// Resale ticket process (For the seller)
export const resaleTicket = async (req, res) => {
  try {
    const { ticketId, resalePrice, reason } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    // ✅ Validate resale eligibility
    if (ticket.resaleStatus !== 'not_listed') {
      return res.status(400).json({ message: 'Ticket is not eligible for resale.' });
    }

    // ✅ Update ticket details
    ticket.resaleStatus = 'listed_for_resale';
    ticket.resalePrice = resalePrice;
    ticket.resaleReason = reason;
    ticket.resaleDate = new Date();
    await ticket.save();

    res.status(200).json({ message: 'Ticket listed for resale.', ticket });
  } catch (error) {
    console.error('❌ Resale Ticket Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Purchase resold ticket (For the buyer)
export const purchaseResaleTicket = async (req, res) => {
  try {
    const { ticketId, userId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.status !== 'resold') {
      return res.status(404).json({ message: 'Ticket not available for purchase.' });
    }

    ticket.status = 'sold';
    await ticket.save();

    const buyerWallet = await Wallet.findOne({ userId });
    if (buyerWallet.balance < ticket.resalePrice) {
      return res.status(400).json({ message: 'Insufficient funds in wallet.' });
    }
    buyerWallet.balance -= ticket.resalePrice;
    await buyerWallet.save();

    await Waitlist.findOneAndDelete({ userId, eventId: ticket.eventId });

    res.status(200).json({ message: 'Ticket purchased successfully!', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all resale-listed tickets (admin only)

export const getResaleTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await Ticket.find({ resaleStatus: 'listed_for_resale' })
      .populate('event', 'eventName eventDate')
      .populate('userId', 'name email'); // ✅ Make sure it's userId, not user

    res.json(tickets);
  } catch (err) {
    console.error('❌ Error fetching resale tickets:', err.message);
    res.status(500).json({ message: 'Failed to load resale tickets' });
  }
});




//Assign Resale Ticket To Waitlist User (Admin only)
export const assignResaleTicketToWaitlistUser = asyncHandler(async (req, res) => {
  const { ticketId, waitlistUserId } = req.body;

  const ticket = await Ticket.findById(ticketId);
  const waitlistEntry = await Waitlist.findById(waitlistUserId).populate('user');

  if (!ticket || !waitlistEntry || !waitlistEntry.user) {
    return res.status(404).json({ message: 'Ticket or User not found' });
  }

  // Reassign ticket
  ticket.user = waitlistEntry.user._id;
  ticket.resaleStatus = 'sold';
  ticket.status = 'active'; // optional
  await ticket.save();

  // Remove user from waitlist
  await Waitlist.findByIdAndDelete(waitlistUserId);

  res.status(200).json({ message: 'Ticket assigned successfully' });
});







/*
export const assignResaleTicketToWaitlistUser = asyncHandler(async (req, res) => {
  const { ticketId, waitlistUserId } = req.body;

  const ticket = await Ticket.findById(ticketId).populate('event');
  const waitlistEntry = await Waitlist.findById(waitlistUserId).populate('user');

  if (!ticket || !waitlistEntry) {
    return res.status(404).json({ message: "Ticket or Waitlist user not found" });
  }

  if (ticket.resaleStatus !== 'listed_for_resale') {
    return res.status(400).json({ message: "Ticket is not available for resale" });
  }

  if (ticket.category !== waitlistEntry.category) {
    return res.status(400).json({ message: "Category mismatch between ticket and waitlist user" });
  }

  // Assign ticket to user
  ticket.user = waitlistEntry.user._id;
  ticket.resaleStatus = 'resold';
  ticket.isResold = true;

  await ticket.save();

  // Update user's wallet (if needed) or notify them
  // Optional: remove waitlist entry
  await Waitlist.findByIdAndDelete(waitlistUserId);

  res.status(200).json({ message: "Ticket assigned successfully", ticket });
});

*/





