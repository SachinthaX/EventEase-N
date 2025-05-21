import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  useColorModeValue,
  Spinner,
  Flex,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getAllEvents } from "../services/eventService.js";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("lg", "dark-lg");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        const currentDate = new Date();
        const upcoming = data.filter(
          (event) => new Date(event.eventDate) > currentDate
        );
        setEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" py={16}>
        <Spinner size="xl" color="teal.400" />
        <Text ml={4}>Loading upcoming events...</Text>
      </Flex>
    );
  }

  return (
    <Box py={20} bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="7xl">
        <Heading
          size="2xl"
          textAlign="center"
          mb={10}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
        >
         
        </Heading>

        {events.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {events.map((event) => (
              <Box
                key={event._id}
                bg={cardBg}
                p={6}
                borderRadius="xl"
                boxShadow={cardShadow}
                _hover={{ transform: "translateY(-6px)" }}
                transition="all 0.3s ease"
              >
                <Stack spacing={3}>
                  {event.imageUrl && (
                    <Image
                      src={event.imageUrl}
                      alt={event.eventName}
                      borderRadius="md"
                      maxH="400px"
                      objectFit="cover"
                      w="100%"
                    />
                  )}

                  <Box>
                    <Heading size="md" color="teal.500">
                      {event.eventName}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(event.eventDate).toLocaleDateString()} |{" "}
                      {event.eventTime}
                    </Text>
                  </Box>

                  <Text fontSize="sm" color="gray.600" noOfLines={3}>
                    {event.eventDescription}
                  </Text>

                  <Text fontWeight="medium" fontSize="sm">
                    📍 {event.eventLocation}
                  </Text>

                  <Box fontSize="sm" mt={2}>
                    <Text fontWeight="bold" color="purple.500" mb={1}>
                      Tickets
                    </Text>
                    <Text>
                      🎫 VVIP: {event.tickets?.VVIP || "—"} | LKR .
                      {event.prices?.VVIP || "—"}
                    </Text>
                    <Text>
                      🎫 VIP: {event.tickets?.VIP || "—"} | LKR .
                      {event.prices?.VIP || "—"}
                    </Text>
                    <Text>
                      🎫 Standard: {event.tickets?.Standard || "—"} | LKR .
                      {event.prices?.Standard || "—"}
                    </Text>
                  </Box>

                  <Button
                    as={RouterLink}
                    to={`/buy-ticket/${event._id}`}
                    colorScheme="teal"
                    mt={4}
                    rounded="full"
                    variant="solid"
                    _hover={{ bg: "teal.600" }}
                  >
                    Buy Ticket
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" mt={10}>
            <Text fontSize="lg" color="gray.500">
              No upcoming events available.
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UpcomingEvents;
