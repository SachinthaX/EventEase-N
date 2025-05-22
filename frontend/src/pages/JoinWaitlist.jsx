// src/pages/JoinWaitlist.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const JoinWaitlist = () => {
  const { id } = useParams(); // eventId
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: "Failed to load event", status: "error" });
        setLoading(false);
      });
  }, [id, toast]);

  const handleJoinWaitlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/waitlist/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          eventId: id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({ title: "You've joined the waitlist!", status: "success" });
        setJoined(true);
      } else {
        toast({ title: data.message || "Error joining waitlist", status: "error" });
      }
    } catch (err) {
      toast({ title: "Server error", status: "error" });
    }
  };

  if (loading) {
    return (
      <Container py={16}>
        <Spinner />
        <Text>Loading event...</Text>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={16}>
      <Container maxW="lg" bg="white" p={6} rounded="xl" shadow="md">
        <Heading size="lg" mb={4}>
          Join Waitlist
        </Heading>
        <Text fontSize="lg" fontWeight="bold">
          {event.eventName}
        </Text>
        <Text color="gray.600" mb={4}>{event.eventDescription}</Text>

        <Text color="red.500" mb={4}>This event is currently sold out.</Text>

        <Button
          colorScheme="teal"
          isDisabled={joined}
          onClick={handleJoinWaitlist}
        >
          {joined ? "You’re on the waitlist!" : "Join Waitlist"}
        </Button>
      </Container>
    </Box>
  );
};

export default JoinWaitlist;
