
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Button,
  Badge,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container py={20} maxW="xl" textAlign="center">
        <Spinner size="xl" color="teal.400" />
        <Text mt={4}>Loading events...</Text>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="4xl" bg="white" p={8} boxShadow="lg" borderRadius="xl">
        <Heading
          size="xl"
          mb={6}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
        >
          All Events
        </Heading>

        <VStack spacing={4} align="stretch">
          {events.length > 0 ? (
            events.map((event) => (
              <Box key={event._id} p={5} shadow="md" borderWidth="1px" rounded="md">
                {event.eventImage && (
                  <Image
                    src={event.eventImage}
                    alt={event.eventName}
                    borderRadius="md"
                    objectFit="cover"
                    maxH="180px"
                    w="100%"
                    mb={3}
                  />
                )}
                <Heading fontSize="lg">{event.eventName}</Heading>
                <Text mt={2}>{event.eventDescription}</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  📍 {event.eventLocation} | 🗓️ {new Date(event.eventDate).toLocaleDateString()} | 🕒 {event.eventTime}
                </Text>
                <Badge mt={2} colorScheme="purple">
                  {Object.values(event.tickets).reduce((a, b) => a + b, 0)} total tickets
                </Badge>
                <Button
                  size="sm"
                  mt={3}
                  colorScheme="teal"
                  onClick={() => navigate(`/buy-ticket/${event._id}`)}
                >
                  View & Buy
                </Button>
              </Box>
            ))
          ) : (
            <Text>No events found.</Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EventList;
