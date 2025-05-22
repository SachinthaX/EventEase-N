// models/WaitlistModel.js

import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  category: { type: String, enum: ['VVIP', 'VIP', 'Standard'], required: true },
  joinedAt: { type: Date, default: Date.now }
  
},

{ timestamps: true }

);

const Waitlist = mongoose.model('Waitlist', waitlistSchema);
export default Waitlist;

