import {
  Box, Container, Heading, Text, VStack, Divider, List, ListItem,
  Spinner, Image, Button, Select, useToast, HStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EventDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignSelections, setAssignSelections] = useState({});
  const token = JSON.parse(sessionStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`);
      const eventData = await res.json();
      setEvent(eventData);

      const waitlistRes = await fetch(`http://localhost:5000/api/waitlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWaitlist(await waitlistRes.json());

      const resaleRes = await fetch('http://localhost:5000/api/tickets/resale', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resaleData = await resaleRes.json();
      const filtered = resaleData.filter(t => t.event && t.event._id === id);
      setResaleTickets(filtered);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (ticketId, waitlistUserId) => {
    if (!waitlistUserId) {
      toast({ title: "Select user before assigning", status: "warning" });
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/tickets/assign', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ ticketId, waitlistUserId }),
});

      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.message || "Assignment failed", status: "error" });
      } else {
        toast({ title: "Ticket assigned!", status: "success" });
        fetchEventDetails();
      }
    } catch {
      toast({ title: "Error assigning ticket", status: "error" });
    }
  };

  const handleExport = () => {
    const resaleSheet = XLSX.utils.json_to_sheet(resaleTickets.map(t => ({
      TicketID: t._id,
      Category: t.category,
      Price: t.resalePrice,
      Assigned: t.status === 'sold' ? 'Yes' : 'No',
    })));

    const waitlistSheet = XLSX.utils.json_to_sheet(waitlist.map(w => ({
      Name: w.user?.name || 'Unknown',
      Email: w.user?.email || 'Unknown',
      Category: w.category,
      JoinedAt: new Date(w.createdAt).toLocaleString(),
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, resaleSheet, "Resale Tickets");
    XLSX.utils.book_append_sheet(wb, waitlistSheet, "Waitlist Users");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Event_${event?.eventName}_Report.xlsx`);
  };

  if (loading) {
    return (
      <Container py={20} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading Event Details...</Text>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="5xl" bg="white" boxShadow="lg" p={8} rounded="xl">
        <HStack justify="space-between" mb={4}>
          <Heading fontSize="2xl" bgGradient="linear(to-r, teal.400, purple.500)" bgClip="text">
            {event?.eventName}
          </Heading>
          <Button colorScheme="purple" onClick={handleExport}>📥 Export Report</Button>
        </HStack>

        {event?.imageUrl && (
          <Image src={event.imageUrl} alt={event.eventName} mb={4} borderRadius="md" maxH="250px" objectFit="cover" />
        )}

        <Text><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</Text>
        <Text><strong>Time:</strong> {event.eventTime}</Text>
        <Text><strong>Location:</strong> {event.eventLocation}</Text>
        <Text><strong>Description:</strong> {event.eventDescription}</Text>

        <Divider my={4} />

        <Heading size="md" mb={2}>🎟️ Tickets Availability</Heading>
        <Text>VVIP: {event.tickets?.VVIP || 0} | VIP: {event.tickets?.VIP || 0} | Standard: {event.tickets?.Standard || 0}</Text>

        <Heading size="md" mt={4} mb={2}>💰 Ticket Prices (LKR)</Heading>
        <Text>VVIP: {event.prices?.VVIP || 0} | VIP: {event.prices?.VIP || 0} | Standard: {event.prices?.Standard || 0}</Text>

        <Divider my={6} />

        <Heading size="md" mb={3}>🎫 Pending Resale Tickets</Heading>
        {resaleTickets.length > 0 ? (
          <List spacing={3}>
            {resaleTickets.map(ticket => {
              const eligibleUsers = waitlist.filter(w => w.category === ticket.category);
              return (
                <ListItem key={ticket._id} p={3} bg="yellow.50" borderRadius="md">
                  <Text><strong>Ticket ID:</strong> {ticket._id}</Text>
                  <Text><strong>Seat:</strong> {ticket.seatNumber}</Text>
                  <Text><strong>Category:</strong> {ticket.category}</Text>
                  <Text><strong>Price:</strong> LKR {ticket.resalePrice}</Text>

                  <Select
                    mt={2}
                    placeholder="Assign to waitlist user"
                    value={assignSelections[ticket._id] || ""}
                    onChange={(e) =>
                      setAssignSelections(prev => ({ ...prev, [ticket._id]: e.target.value }))
                    }
                  >
                    {eligibleUsers.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.user?.name || "Unknown"} ({user.category})
                      </option>
                    ))}
                  </Select>

                  <Button
                    mt={2}
                    colorScheme="teal"
                    onClick={() => handleAssign(ticket._id, assignSelections[ticket._id])}
                  >
                    Assign Ticket
                  </Button>
                </ListItem>
              );
            })}
          </List>
        ) : <Text color="gray.500">No resale tickets listed.</Text>}

        <Divider my={6} />
        <Heading size="md" mb={3}>📋 Waitlist Users</Heading>
        {waitlist.length > 0 ? (
          <List spacing={2}>
            {waitlist.map(entry => (
              <ListItem key={entry._id} p={2} bg="gray.100" borderRadius="md">
                <Text><strong>Name:</strong> {entry.user?.name || "N/A"}</Text>
                <Text><strong>Email:</strong> {entry.user?.email || "N/A"}</Text>
                <Text><strong>Category:</strong> {entry.category}</Text>
                <Text><strong>Joined At:</strong> {new Date(entry.createdAt).toLocaleString()}</Text>
              </ListItem>
            ))}
          </List>
        ) : <Text color="gray.500">No users in waitlist.</Text>}
      </Container>
    </Box>
  );
};

export default EventDetails;
