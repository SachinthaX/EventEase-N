import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Select,
  Button,
  useToast,
  VStack,
  Spinner,
  Badge,
  RadioGroup,
  Radio,
  HStack,
  Image,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BuyTicket = () => {
  const { id } = useParams(); // Event ID
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch event data
  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: 'Failed to load event', status: 'error' });
        setLoading(false);
      });
  }, [id, toast]);

  // Handle Purchase
  const handlePurchase = async () => {
    if (!category) {
      toast({ title: 'Please select a category.', status: 'warning' });
      return;
    }

    const availableSeats = event.tickets[category];
    const price = event.prices[category];
    const total = price * quantity;

    if (availableSeats < quantity) {
      toast({
        title: `Only ${availableSeats} ${category} ticket(s) left.`,
        status: 'error',
      });
      return;
    }

    const payload = {
      eventId: event._id,
      eventDate: event.eventDate,
      ticketPrice: price,
      quantity,
      category,
      paymentMethod,
    };

    try {
      const response = await fetch('http://localhost:5000/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Tickets Purchased!',
          description: `${quantity} ${category} ticket(s) purchased.`,
          status: 'success',
          duration: 3000,
        });
        navigate('/profile');
      } else {
        toast({ title: data.message || 'Purchase failed', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error' });
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          category,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Joined Waitlist',
          description: `You have been added to the waitlist for ${category} ticket.`,
          status: 'info',
          duration: 3000,
        });
        navigate('/profile');
      } else {
        toast({ title: data.message || 'Failed to join waitlist', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxW="lg" py={20} textAlign="center">
        <Spinner size="xl" color="teal.400" />
        <Text mt={4}>Loading event details...</Text>
      </Container>
    );
  }

  const availableSeats = category ? event.tickets[category] : null;

  return (
    <Box bg="gray.50" py={20}>
      <Container maxW="xl" bg="white" p={8} boxShadow="lg" rounded="xl">
        {/* ✅ Event Banner Image */}
        {event.imageUrl && (
          <Image
          src={event.imageUrl}
          alt={event.eventName}
          borderRadius="xl"
          objectFit="cover"
          maxH="600px"
          w="100%"
          mb={6}
          
        />
        
        )}

        <Heading
          size="lg"
          mb={4}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
        >
          Purchase Ticket
        </Heading>

        <Text fontSize="lg" fontWeight="bold" mb={2}>
          {event.eventName}
        </Text>
        <Text color="gray.600">{event.eventDescription}</Text>
        <Text mt={2} color="gray.600">
          📍 {event.eventLocation} | 🕓 {event.eventTime} | 📅{' '}
          {new Date(event.eventDate).toLocaleDateString()}
        </Text>

        <VStack spacing={4} mt={6} align="stretch">
          {/* Category Selection */}
          <Select
            placeholder="Select ticket category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setQuantity(1); // reset quantity if category changes
            }}
          >
            <option value="VVIP">VVIP - LKR. {event.prices.VVIP} ({event.tickets.VVIP} left)</option>
            <option value="VIP">VIP - LKR. {event.prices.VIP} ({event.tickets.VIP} left)</option>
            <option value="Standard">Standard - LKR. {event.prices.Standard} ({event.tickets.Standard} left)</option>
          </Select>

          {/* Quantity Selector */}
          <Select
            placeholder="Number of tickets"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            isDisabled={!category}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>

          {/* Payment Method */}
          <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
            <HStack spacing={4}>
              <Radio value="card">Pay with Card</Radio>
              <Radio value="wallet">Pay with Wallet</Radio>
            </HStack>
          </RadioGroup>

          {/* Total Price Display */}
          {category && (
            <Text>
              Total Price:{' '}
              <Badge colorScheme="green">LKR. {event.prices[category] * quantity}</Badge>
            </Text>
          )}

          {category && availableSeats === 0 ? (
            <Button
              colorScheme="orange"
              onClick={handleJoinWaitlist}
              rounded="full"
              _hover={{ bg: 'orange.400' }}
            >
              Join Waitlist
            </Button>
          ) : (
            <Button
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, purple.500)"
              _hover={{ bgGradient: 'linear(to-r, purple.500, teal.400)' }}
              color="white"
              rounded="full"
              onClick={handlePurchase}
              isDisabled={!category || !quantity}
            >
              Confirm & Pay
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BuyTicket;
