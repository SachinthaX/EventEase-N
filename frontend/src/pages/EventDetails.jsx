import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  List,
  ListItem,
  Badge,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`);
      const eventData = await res.json();
      setEvent(eventData);

      const token = JSON.parse(localStorage.getItem('user'))?.token;

      const waitlistRes = await fetch(`http://localhost:5000/api/waitlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const waitlistData = await waitlistRes.json();
      setWaitlist(waitlistData);

      const resaleRes = await fetch('http://localhost:5000/api/tickets/resale', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resaleData = await resaleRes.json();
      const resaleForEvent = Array.isArray(resaleData)
        ? resaleData.filter(t => t.event && t.event._id === id)
        : [];
      setResaleTickets(resaleForEvent);

    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container py={20} textAlign="center">
        <Spinner color="teal.500" size="xl" />
        <Text mt={4}>Loading Event Details...</Text>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="4xl" bg="white" boxShadow="lg" p={8} rounded="xl">
        <Heading mb={4} fontSize="2xl" bgGradient="linear(to-r, teal.400, purple.500)" bgClip="text">
          {event?.eventName || 'Event Details'}
        </Heading>

        {event?.imageUrl && (
          <Image src={event.imageUrl} alt={event.eventName} mb={4} borderRadius="md" maxH="250px" objectFit="cover" />
        )}

        <Text mb={2}><strong>ID:</strong> {event._id}</Text>
        <Text mb={2}><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</Text>
        <Text mb={2}><strong>Time:</strong> {event.eventTime}</Text>
        <Text mb={2}><strong>Location:</strong> {event.eventLocation}</Text>
        <Text mb={2}><strong>Description:</strong> {event.eventDescription}</Text>

        <Divider my={4} />

        <Heading size="md" mb={2}>🎟️ Tickets Availability</Heading>
        <Text>VVIP: {event.tickets?.VVIP || 0}</Text>
        <Text>VIP: {event.tickets?.VIP || 0}</Text>
        <Text>Standard: {event.tickets?.Standard || 0}</Text>

        <Heading size="md" mt={4} mb={2}>💰 Ticket Prices (LKR)</Heading>
        <Text>VVIP: {event.prices?.VVIP || 0}</Text>
        <Text>VIP: {event.prices?.VIP || 0}</Text>
        <Text>Standard: {event.prices?.Standard || 0}</Text>

        <Divider my={6} />

        <Heading size="md" mb={3}>🎫 Pending Resale Tickets</Heading>
        {resaleTickets.length > 0 ? (
          <List spacing={2}>
            {resaleTickets.map((t) => (
              <ListItem key={t._id} p={2} bg="yellow.100" rounded="md">
                Ticket ID: {t._id} — {t.user?.name || 'Unknown'} ({t.user?.email}) — Seat: {t.seatNumber} — Price: LKR {t.resalePrice}
              </ListItem>
            ))}
          </List>
        ) : (
          <Text color="gray.500">No resale tickets listed.</Text>
        )}

        <Divider my={6} />

        <Heading size="md" mb={3}>📋 Waitlist Users</Heading>
        {waitlist.length > 0 ? (
          <List spacing={2}>
            {waitlist.map((entry) => (
              <ListItem key={entry._id} p={2} bg="gray.100" rounded="md">
              <Text><strong>Entry ID:</strong> {entry._id}</Text>
              <Text><strong>User ID:</strong> {entry.user?._id || "N/A"}</Text>
              <Text><strong>Name:</strong> {entry.user?.name || "N/A"}</Text>
              <Text><strong>Email:</strong> {entry.user?.email || "N/A"}</Text>
              <Text><strong>Category:</strong> {entry.category}</Text>
              <Text><strong>Joined At:</strong> {new Date(entry.createdAt).toLocaleString()}</Text>
            </ListItem>
            
            ))}
          </List>
        ) : (
          <Text color="gray.500">No users in the waitlist.</Text>
        )}

      </Container>
    </Box>
  );
};

export default EventDetails;
