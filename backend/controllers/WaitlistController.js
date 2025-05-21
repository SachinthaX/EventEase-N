//controllers/WaitlistController.js

import Waitlist from '../models/WaitlistModel.js';


export const joinWaitlist = async (req, res) => {
  try {
    const { eventId, category } = req.body;

    // Make sure user is authenticated
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!eventId || !category) {
      return res.status(400).json({ message: 'Event ID and category are required' });
    }

    // Prevent duplicate waitlist entry
    const alreadyExists = await Waitlist.findOne({ eventId, user: userId, category });
    if (alreadyExists) {
      return res.status(400).json({ message: 'Already joined waitlist for this category' });
    }

    const waitlistEntry = new Waitlist({
      eventId,
      user: userId,
      category,
    });

    await waitlistEntry.save();

    res.status(201).json({ message: 'Joined waitlist successfully', waitlistEntry });
  } catch (err) {
    console.error('❌ Join Waitlist Error:', err.message);
    res.status(500).json({ message: 'Server error joining waitlist' });
  }
};




export const getWaitlistByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const waitlist = await Waitlist.find({ eventId })
      .populate('user', 'name email') // ✅ Populate user details
      .sort({ createdAt: 1 });

    res.status(200).json(waitlist);
  } catch (err) {
    console.error('Error fetching waitlist by event:', err);
    res.status(500).json({ message: 'Failed to fetch waitlist users.' });
  }
};



export const getUserWaitlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const waitlist = await Waitlist.find({ user: userId  }).populate('eventId'); // Make sure eventId is correct in your schema

    res.json(waitlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch waitlist" });
  }
};

