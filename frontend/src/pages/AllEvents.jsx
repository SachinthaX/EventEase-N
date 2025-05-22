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
import jsPDF from "jspdf";               // default import
import autoTable from "jspdf-autotable"; // import plugin factory

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
      toast({ title: "Failed to load events", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    const now = new Date();
    let filtered = events;
    if (value === "future") {
      filtered = events.filter(ev => new Date(ev.eventDate) > now);
    } else if (value === "past") {
      filtered = events.filter(ev => new Date(ev.eventDate) < now);
    }
    setFilteredEvents(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      toast({ title: "Event deleted", status: "success" });
      fetchEvents();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const handleEdit = (ev) => {
    setEditingEvent({ ...ev });
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      let updated = { ...editingEvent };
      if (newImageFile) {
        updated.imageUrl = await uploadImageToFirebase(newImageFile);
      }
      await updateEvent(updated._id, updated);
      toast({ title: "Event updated", status: "success" });
      setIsEditOpen(false);
      setNewImageFile(null);
      fetchEvents();
    } catch {
      toast({ title: "Update failed", status: "error" });
    }
  };

  // —— PDF Generation ——
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📅 All Events Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [[
        "Name", "Date", "Time", "Location",
        "VVIP #", "VVIP ₨",
        "VIP #", "VIP ₨",
        "Std #", "Std ₨"
      ]],
      body: events.map(ev => [
        ev.eventName,
        new Date(ev.eventDate).toLocaleDateString(),
        ev.eventTime,
        ev.eventLocation,
        ev.tickets?.VVIP || 0,
        ev.prices?.VVIP || 0,
        ev.tickets?.VIP || 0,
        ev.prices?.VIP || 0,
        ev.tickets?.Standard || 0,
        ev.prices?.Standard || 0,
      ]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    });

    doc.save("All_Events_Report.pdf");
  };

  return (
    <Box bg={bg} minH="100vh" py={16}>
      <Container maxW="7xl">
        <Heading
          textAlign="center"
          size="2xl"
          mb={6}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
        >
          All Events
        </Heading>

        <HStack mb={6} spacing={4}>
          <Select w="200px" value={filter} onChange={handleFilterChange} colorScheme="teal">
            <option value="all">All Events</option>
            <option value="future">Future Events</option>
            <option value="past">Past Events</option>
          </Select>
          <Button colorScheme="purple" onClick={generatePDF}>
            📄 Download Events Report
          </Button>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" color="teal.400" />
            <Text mt={4}>Loading events...</Text>
          </Box>
        ) : filteredEvents.length > 0 ? (
          <Box overflowX="auto" bg={tableBg} p={4} borderRadius="md" boxShadow="md">
            <Table variant="simple" size="sm">
              <Thead bg="teal.500">
                <Tr>
                  <Th color="white">Image</Th>
                  <Th color="white">Name</Th>
                  <Th color="white">Date & Time</Th>
                  <Th color="white">Location</Th>
                  <Th color="white">Tickets</Th>
                  <Th color="white">Prices (LKR)</Th>
                  <Th color="white">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredEvents.map(ev => (
                  <Tr key={ev._id}>
                    <Td><Image src={ev.imageUrl} alt="" boxSize="60px" objectFit="cover" borderRadius="md" /></Td>
                    <Td>{ev.eventName}</Td>
                    <Td>
                      {new Date(ev.eventDate).toLocaleDateString()}
                      <br/><Text fontSize="sm" color="gray.500">{ev.eventTime}</Text>
                    </Td>
                    <Td>{ev.eventLocation}</Td>
                    <Td>
                      VVIP: {ev.tickets?.VVIP||0}<br/>
                      VIP: {ev.tickets?.VIP||0}<br/>
                      Std: {ev.tickets?.Standard||0}
                    </Td>
                    <Td>
                      VVIP: ₨{ev.prices?.VVIP||0}<br/>
                      VIP: ₨{ev.prices?.VIP||0}<br/>
                      Std: ₨{ev.prices?.Standard||0}
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Button size="xs" colorScheme="teal" onClick={() => window.location.href = `/admin/event/${ev._id}`}>View</Button>
                        <Button size="xs" colorScheme="blue" onClick={() => handleEdit(ev)}>Edit</Button>
                        <Button size="xs" colorScheme="red" onClick={() => handleDelete(ev._id)}>Delete</Button>
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box textAlign="center" mt={20}><Text>No events available.</Text></Box>
        )}
        '

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
