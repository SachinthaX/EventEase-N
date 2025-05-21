// models/WalletModel.js

import mongoose from 'mongoose';

// Define the wallet schema
const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // Assuming you have a Transaction model
    },
  ],
});

// Create the Wallet model using the schema
const Wallet = mongoose.model('Wallet', walletSchema);

// Export the Wallet model as default
export default Wallet;
