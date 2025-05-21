import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Container, Heading, Spinner, Text, Table,
  Thead, Tbody, Tr, Th, Td, useToast
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminWaitlist = () => {
  const { eventId } = useParams();
  const { user } = useContext(AuthContext);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/waitlist/${eventId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch waitlist');
        setWaitlist(data);
      } catch (err) {
        toast({ title: err.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchWaitlist();
  }, [eventId, user, toast]);

  return (
    <Box py={16} bg="gray.50" minH="100vh">
      <Container maxW="5xl">
        <Heading mb={6} bgGradient="linear(to-r, teal.400, purple.500)" bgClip="text">
          Event Waitlist
        </Heading>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="teal.400" />
            <Text mt={4}>Loading waitlist...</Text>
          </Box>
        ) : waitlist.length > 0 ? (
          <Table variant="simple" size="md" bg="white" rounded="lg" shadow="md">
            <Thead bg="teal.500">
              <Tr>
                <Th color="white">User Name</Th>
                <Th color="white">Email</Th>
                <Th color="white">Joined At</Th>
                <Th color="white">Category</Th>
                <Th color="white">User ID</Th>
                <Th color="white">Event ID</Th>

              </Tr>
            </Thead>
            <Tbody>
              {waitlist.map((entry) => (
                <Tr key={entry._id}>
                  <Td>{entry.userId?.name || 'N/A'}</Td>
                  <Td>{entry.userId?.email || 'N/A'}</Td>
                  <Td>{new Date(entry.createdAt).toLocaleString()}</Td>
                  <Td>{entry.category}</Td>
                  <Td>{entry.userId?._id}</Td>
                  <Td>{entry.eventId}</Td>


                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No users in the waitlist for this event.</Text>
        )}
      </Container>
    </Box>
  );
};

export default AdminWaitlist;
