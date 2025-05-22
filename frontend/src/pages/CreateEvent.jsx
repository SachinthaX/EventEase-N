import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Grid,
  GridItem,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService.js";
import { uploadImageToFirebase } from "../utils/uploadToFirebase";

const CreateEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    tickets: { VVIP: 0, VIP: 0, Standard: 0 },
    prices: { VVIP: 0, VIP: 0, Standard: 0 },
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    const [category, type] = name.split("_");
    const numericValue = Math.max(0, Number(value));

    if (type === "tickets") {
      setEventData((prev) => ({
        ...prev,
        tickets: { ...prev.tickets, [category]: numericValue },
      }));
    } else if (type === "price") {
      setEventData((prev) => ({
        ...prev,
        prices: { ...prev.prices, [category]: numericValue },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    if (eventData.eventName.length < 4) {
      toast({ title: "Event name must be at least 4 characters", status: "warning" });
      return;
    }

    // Past date validation
    const today = new Date().toISOString().split("T")[0];
    if (eventData.eventDate < today) {
      toast({ title: "Event date cannot be in the past", status: "warning" });
      return;
    }

    // Check for negative values
    const hasNegativeTickets = Object.values(eventData.tickets).some(val => val < 0);
    const hasNegativePrices = Object.values(eventData.prices).some(val => val < 0);
    if (hasNegativeTickets || hasNegativePrices) {
      toast({ title: "Ticket counts and prices must be non-negative", status: "warning" });
      return;
    }

    if (!imageFile) {
      toast({ title: "Please select an event image", status: "warning" });
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImageToFirebase(imageFile);
      const payload = { ...eventData, imageUrl };

      await createEvent(payload);
      toast({
        title: "Event created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/events");
    } catch (err) {
      console.error("Error creating event:", err);
      toast({
        title: "Error creating event.",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box bg="gray.50" py={16} px={4} minH="100vh">
      <Container maxW="4xl" bg="white" boxShadow="xl" p={8} borderRadius="xl">
        <Heading
          textAlign="center"
          fontSize={{ base: "2xl", md: "3xl" }}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
          mb={8}
        >
          Create a New Event
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input
                name="eventName"
                value={eventData.eventName}
                onChange={handleInputChange}
                placeholder="Enter your event name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Description</FormLabel>
              <Textarea
                name="eventDescription"
                value={eventData.eventDescription}
                onChange={handleInputChange}
                placeholder="Describe the event"
                rows={4}
              />
            </FormControl>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="eventDate"
                  value={eventData.eventDate}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  name="eventTime"
                  value={eventData.eventTime}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="eventLocation"
                value={eventData.eventLocation}
                onChange={handleInputChange}
                placeholder="Event venue or address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </FormControl>

            <Heading size="md" pt={6} color="teal.600">
              Ticket Options
            </Heading>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              {["VVIP", "VIP", "Standard"].map((category) => (
                <GridItem key={category} bg="gray.100" p={4} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>{category} Tickets</Text>
                  <FormControl isRequired mb={2}>
                    <FormLabel fontSize="sm">Number of Tickets</FormLabel>
                    <Input
                      type="number"
                      name={`${category}_tickets`}
                      value={eventData.tickets[category]}
                      onChange={handleTicketChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Price (LKR)</FormLabel>
                    <Input
                      type="number"
                      name={`${category}_price`}
                      value={eventData.prices[category]}
                      onChange={handleTicketChange}
                    />
                  </FormControl>
                </GridItem>
              ))}
            </Grid>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              mt={6}
              isLoading={uploading}
              rounded="full"
              bgGradient="linear(to-r, teal.400, purple.500)"
              _hover={{ bgGradient: "linear(to-r, purple.500, teal.500)" }}
              color="white"
            >
              Create Event
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
};

export default CreateEvent;
