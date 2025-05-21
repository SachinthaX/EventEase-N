import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const AutoIncrementFactory = AutoIncrement(mongoose);

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: Number, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventDate: { type: Date },
  ticketPrice: { type: Number },
  seatNumber: { type: String },
  category: { type: String, required: true, enum: ['VVIP', 'VIP', 'Standard'], },
  purchaseDate: { type: Date, default: Date.now },
  resaleStatus: { type: String, enum: ['not_listed', 'listed_for_resale', 'resold'], default: 'not_listed' },
  resaleReason: { type: String, default: null },
  resalePrice: { type: Number, default: null },
  resaleDate: { type: Date, default: null },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  buyerName: { type: String, default: null },
});

ticketSchema.plugin(AutoIncrementFactory, { inc_field: 'ticketNumber' });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;




/*tickets: {
  VVIP: { type: Number, required: true, default: 0 },
  VIP: { type: Number, required: true, default: 0 },
  Standard: { type: Number, required: true, default: 0 },
},
prices: {
  VVIP: { type: Number, required: true, default: 0 },
  VIP: { type: Number, required: true, default: 0 },
  Standard: { type: Number, required: true, default: 0 },
},
*/