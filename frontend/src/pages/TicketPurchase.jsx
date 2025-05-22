// src/pages/TicketPurchase.jsx
import React, { useState } from 'react';

const TicketPurchase = () => {
  const [ticketPrice, setTicketPrice] = useState(50); // Assume a fixed ticket price for now
  const [seatNumber, setSeatNumber] = useState('');

  const handlePurchase = async () => {
    // Use the logged-in user's token to make the purchase
    const response = await fetch('/api/tickets/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ ticketPrice, seatNumber }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Ticket purchased successfully');
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div>
      <h2>Purchase Ticket</h2>
      <input
        type="text"
        placeholder="Enter seat number"
        value={seatNumber}
        onChange={(e) => setSeatNumber(e.target.value)}
      />
      <button onClick={handlePurchase}>Buy Ticket for ${ticketPrice}</button>
    </div>
  );
};

export default TicketPurchase;
