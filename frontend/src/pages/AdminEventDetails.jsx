import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Container, Heading, Spinner, Text, Table,
  Thead, Tbody, Tr, Th, Td, useToast, Divider
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminEventDetails = () => {
  const { id } = useParams(); // Event ID from route
  const { user } = useContext(AuthContext);
  const [waitlist, setWaitlist] = useState([]);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = user?.token;

        const [waitlistRes, resaleRes] = await Promise.all([
          fetch(`http://localhost:5000/api/waitlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/tickets/resale`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const waitlistData = await waitlistRes.json();
        const resaleData = await resaleRes.json();

        setWaitlist(waitlistData);
        setResaleTickets(Array.isArray(resaleData)
          ? resaleData.filter(t => t.event?._id === id)
          : []);
      } catch (err) {
        toast({ title: 'Error loading data', status: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [id, user, toast]);

  return (
    <Box py={10} bg="gray.50" minH="100vh">
      <Container maxW="6xl">
        <Heading mb={4} fontSize="2xl" color="teal.600">
          Admin Event Insights
        </Heading>

        {loading ? (
          <Box py={20} textAlign="center">
            <Spinner size="xl" />
            <Text mt={4}>Loading event data...</Text>
          </Box>
        ) : (
          <>
            <Heading size="md" mt={6} mb={2}>📋 Waitlist Users</Heading>
            {waitlist.length > 0 ? (
              <Table variant="striped" size="sm" mb={8}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Category</Th>
                    <Th>Joined At</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {waitlist.map((entry) => (
                    <Tr key={entry._id}>
                      <Td>{entry.user?.name || 'N/A'}</Td>
                      <Td>{entry.user?.email || 'N/A'}</Td>
                      <Td>{entry.category}</Td>
                      <Td>{new Date(entry.createdAt).toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <Text>No users in waitlist.</Text>}

            <Divider my={6} />

            <Heading size="md" mb={2}>🎟️ Resell Tickets</Heading>
            {resaleTickets.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Seat</Th>
                    <Th>Price</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resaleTickets.map((ticket) => (
                    <Tr key={ticket._id}>
                      <Td>{ticket.user?.name}</Td>
                      <Td>{ticket.user?.email}</Td>
                      <Td>{ticket.seatNumber}</Td>
                      <Td>LKR {ticket.resalePrice}</Td>
                      <Td>{ticket.resaleStatus}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <Text>No resale tickets listed.</Text>}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminEventDetails;
