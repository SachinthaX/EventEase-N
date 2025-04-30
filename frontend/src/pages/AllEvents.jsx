import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useColorModeValue,
  Button,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Textarea,
  Grid,
  GridItem,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { getAllEvents, deleteEvent, updateEvent } from "../services/eventService.js";
import { uploadImageToFirebase } from '../utils/uploadToFirebase.js';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "gray.800");
  const tableBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    const currentDate = new Date();
    let filtered = [];

    if (value === "future") {
      filtered = events.filter((event) => new Date(event.eventDate) > currentDate);
    } else if (value === "past") {
      filtered = events.filter((event) => new Date(event.eventDate) < currentDate);
    } else {
      filtered = events;
    }

    setFilteredEvents(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      toast({ title: "Event deleted", status: "success" });
      fetchEvents();
    } catch (err) {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent({ ...event });
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      let updatedEvent = { ...editingEvent };

      if (newImageFile) {
        const newImageUrl = await uploadImageToFirebase(newImageFile);
        updatedEvent.imageUrl = newImageUrl;
      }

      await updateEvent(updatedEvent._id, updatedEvent);
      toast({ title: "Event updated", status: "success" });

      setIsEditOpen(false);
      setNewImageFile(null);
      fetchEvents();
    } catch (err) {
      toast({ title: "Update failed", status: "error" });
    }
  };

  return (
    <Box bg={bg} minH="100vh" py={16}>
      <Container maxW="7xl">
        <Heading textAlign="center" size="2xl" mb={10} bgGradient="linear(to-r, teal.400, purple.500)" bgClip="text">
          All Events
        </Heading>

        <Box mb={6} maxW="300px">
          <Select value={filter} onChange={handleFilterChange} colorScheme="teal">
            <option value="all">All Events</option>
            <option value="future">Future Events</option>
            <option value="past">Past Events</option>
          </Select>
        </Box>

        {loading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" color="teal.400" />
            <Text mt={4}>Loading events...</Text>
          </Box>
        ) : filteredEvents.length > 0 ? (
          <Box overflowX="auto" borderRadius="md" boxShadow="md" bg={tableBg} p={4}>
            <Table variant="simple" size="sm">
              <Thead bg="teal.500">
                <Tr>
                  <Th color="white">Image</Th>
                  <Th color="white">Event Name</Th>
                  <Th color="white">Date & Time</Th>
                  <Th color="white">Location</Th>
                  <Th color="white">Tickets</Th>
                  <Th color="white">Prices (LKR)</Th>
                  <Th color="white">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredEvents.map((event) => (
                  <Tr key={event._id}>
                    <Td>
                      <Image src={event.imageUrl} alt={event.eventName} boxSize="60px" objectFit="cover" borderRadius="md" />
                    </Td>
                    <Td>{event.eventName}</Td>
                    <Td>
                      {new Date(event.eventDate).toLocaleDateString()}<br />
                      <Text fontSize="sm" color="gray.500">{event.eventTime}</Text>
                    </Td>
                    <Td>{event.eventLocation}</Td>
                    <Td>
                      VVIP: {event.tickets?.VVIP || 0} | VIP: {event.tickets?.VIP || 0} | Standard: {event.tickets?.Standard || 0}
                    </Td>
                    <Td>
                      VVIP: LKR {event.prices?.VVIP || 0} <br /> VIP: LKR {event.prices?.VIP || 0} <br /> Standard: LKR {event.prices?.Standard || 0}
                    </Td>
                    <Td>
                      <VStack spacing={1} align="start">
                        <Button size="xs" colorScheme="teal" onClick={() => window.location.href = `/admin/event/${event._id}`}>View</Button>
                        <Button size="xs" colorScheme="blue" onClick={() => handleEdit(event)}>Edit</Button>
                        <Button size="xs" colorScheme="red" onClick={() => handleDelete(event._id)}>Delete</Button>
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box textAlign="center" mt={20}>
            <Text fontSize="lg" color="gray.500">No events available.</Text>
          </Box>
        )}

        {/* Edit Modal */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {editingEvent && (
                <VStack spacing={4} align="stretch">
                  <Input
                    placeholder="Event Name"
                    value={editingEvent.eventName}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={editingEvent.eventDescription}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDescription: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={editingEvent.eventDate?.slice(0, 10)}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={editingEvent.eventTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventTime: e.target.value })}
                  />
                  <Input
                    placeholder="Location"
                    value={editingEvent.eventLocation}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventLocation: e.target.value })}
                  />

                  <Box>
                    <Text fontSize="sm" mb={1}>Current Image</Text>
                    <Image src={editingEvent.imageUrl} alt="Current" boxSize="100px" borderRadius="md" mb={2} />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.target.files[0])}
                    />
                  </Box>

                  <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                    {['VVIP', 'VIP', 'Standard'].map((cat) => (
                      <GridItem key={cat}>
                        <Text fontSize="sm" fontWeight="bold">{cat}</Text>
                        <Input
                          type="number"
                          placeholder="Tickets"
                          value={editingEvent.tickets[cat]}
                          onChange={(e) => setEditingEvent({
                            ...editingEvent,
                            tickets: { ...editingEvent.tickets, [cat]: Number(e.target.value) },
                          })}
                        />
                        <Input
                          mt={1}
                          type="number"
                          placeholder="Price"
                          value={editingEvent.prices[cat]}
                          onChange={(e) => setEditingEvent({
                            ...editingEvent,
                            prices: { ...editingEvent.prices, [cat]: Number(e.target.value) },
                          })}
                        />
                      </GridItem>
                    ))}
                  </Grid>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsEditOpen(false)} mr={3}>Cancel</Button>
              <Button colorScheme="teal" onClick={handleEditSave}>Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default AllEvents;
