// models/EventModel.js

import mongoose from 'mongoose';

// Defining the schema for Event
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      unique: true,  // Ensuring each event has a unique name
    },
    eventDescription: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,  // Could be formatted as HH:MM, 24-hour format
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventImage: {
      type: String,
      default: '', // optional
    },
    imageUrl: {
      type: String,
      default: '', // optional
    },
    tickets: {
      VVIP: {
        type: Number,  // The number of VVIP tickets available
        required: true,
        default: 0,
      },
      VIP: {
        type: Number,  // The number of VIP tickets available
        required: true,
        default: 0,
      },
      Standard: {
        type: Number,  // The number of Standard tickets available
        required: true,
        default: 0,
      },
    },
    prices: {
      VVIP: {
        type: Number,  // Price for VVIP tickets
        required: true,
      },
      VIP: {
        type: Number,  // Price for VIP tickets
        required: true,
      },
      Standard: {
        type: Number,  // Price for Standard tickets
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

export default Event;
