// Profile.jsx – Enhanced UI/UX for Account Settings + Ticket Management

import React, { useEffect, useState, useRef } from "react";
import {
  Box, Container, Heading, Text, Spinner, Alert, AlertIcon, VStack, List, ListItem, Divider,
  Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Textarea,
  FormControl, FormLabel, Input, AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, Center, Stack,
  InputGroup, InputRightElement, Skeleton, SkeletonText
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axios";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [profile, setProfile] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [error, setError] = useState(null);
  const [resellReason, setResellReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTickets, setSelectedEventTickets] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user?.token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(data);
        setFormData({ name: data.name, email: data.email });
      } catch {
        setError("Failed to load profile");
      }
    };

    const fetchWaitlist = async () => {
      try {
        const res = await axios.get("/api/waitlist/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setWaitlist(res.data);
      } catch (err) {
        console.error("Failed to fetch waitlist:", err.message);
      }
    };

    fetchProfile();
    fetchWaitlist();
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", status: "info", duration: 2500, position: "top-right" });
    navigate("/");
  };

  const handleProfileUpdate = async () => {
    try {
      const { data } = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(data);
      toast({ title: "Profile updated", status: "success", duration: 2500, position: "top-right" });
    } catch {
      toast({ title: "Update failed", status: "error", duration: 2500 });
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("/api/users/password", passwordData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast({ title: "Password updated", status: "success", duration: 2500 });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch {
      toast({ title: "Password change failed", status: "error" });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete("/api/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast({ title: "Profile deleted", status: "info" });
      logout();
      navigate("/register");
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const handleResell = async (ticket) => {
    try {
      const res = await axios.post("/api/tickets/resell", {
        ticketId: ticket._id,
        reason: resellReason,
        resalePrice: ticket.ticketPrice,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.status === 200) {
        toast({ title: "Ticket listed for resale", status: "success" });
        setIsModalOpen(false);
        setResellReason("");
        setProfile(null); // trigger refetch
      } else {
        toast({ title: "Resell failed", status: "error" });
      }
    } catch {
      toast({ title: "Resell error", status: "error" });
    }
  };

  if (error) {
    return (
      <Container maxW="lg" py={16}>
        <Alert status="error" rounded="md"><AlertIcon />{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxW="4xl" py={10}>
        <Skeleton height="30px" mb={4} />
        <SkeletonText mt="4" noOfLines={6} spacing="4" />
      </Container>
    );
  }

  const now = new Date();
  const boughtTickets = profile.tickets?.filter((t) => t.resaleStatus === "not_listed") || [];
  const upcomingTickets = boughtTickets.filter((t) => new Date(t.event?.eventDate) >= now);
  const pastTickets = boughtTickets.filter((t) => new Date(t.event?.eventDate) < now);
  const pendingResell = profile.tickets?.filter((t) => t.resaleStatus === "listed_for_resale") || [];
  const soldResell = profile.tickets?.filter((t) => t.resaleStatus === "resold") || [];

  const groupedUpcoming = upcomingTickets.reduce((acc, ticket) => {
    const eventId = ticket.event?._id || "unknown";
    if (!acc[eventId]) acc[eventId] = { event: ticket.event, tickets: [] };
    acc[eventId].tickets.push(ticket);
    return acc;
  }, {});

  return (
    <Box bg="gray.50" minH="100vh" py={16}>
      <Container maxW="4xl" bg="white" boxShadow="xl" p={8} rounded="2xl">
        <HStack justifyContent="space-between" mb={6}>
          <Heading fontSize="2xl">{profile.name}'s Profile</Heading>
          <Button colorScheme="red" onClick={handleLogout} size="sm">Logout</Button>
        </HStack>

        {/* 🧾 Account Settings */}
        <Box p={6} bg="gray.100" rounded="xl" mb={10}>
          <Heading size="md" mb={4}>Account Settings</Heading>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Edit Profile</Tab>
              <Tab>Security</Tab>
            </TabList>
            <TabPanels>
              
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Box w="100px" fontWeight="semibold">Name:</Box>
                    <Text flex="1">{profile.name}</Text>
                  </HStack>
                  <HStack>
                    <Box w="100px" fontWeight="semibold">Email:</Box>
                    <Text flex="1">{profile.email}</Text>
                  </HStack>
                  <HStack>
                    <Box w="100px" fontWeight="semibold">Wallet:</Box>
                    <Text flex="1">LKR {profile.wallet?.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </FormControl>
                  <Button colorScheme="blue" onClick={handleProfileUpdate}>Save Changes</Button>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Current Password</FormLabel>
                    <Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                      <Input type={showPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                      <InputRightElement>
                        <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Button colorScheme="blue" onClick={handlePasswordChange}>Update Password</Button>
                  <Button colorScheme="red" onClick={onOpen}>Delete Account</Button>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* 🎟️ Tickets & Waitlist */}
        <Box p={6} bg="gray.100" rounded="xl">
          <Heading size="md" mb={4}>Tickets & Waitlist</Heading>
          <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList>
              <Tab>Upcoming</Tab>
              <Tab>Past</Tab>
              <Tab>Resell</Tab>
              <Tab>Sold</Tab>
              <Tab>Waitlist</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {Object.keys(groupedUpcoming).length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {Object.values(groupedUpcoming).map((group, i) => (
                      <Box key={i} p={4} bg="white" borderRadius="md" shadow="sm">
                        <Text fontWeight="bold">{group.event?.eventName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          📍 {group.event?.eventLocation} | 🗓️ {new Date(group.event?.eventDate).toLocaleDateString()}
                        </Text>
                        <Text>🎟️ Tickets: {group.tickets.length}</Text>
                        <Button mt={2} size="sm" onClick={() => {
                          setSelectedEventTickets(group.tickets);
                          setIsModalOpen(true);
                        }}>View Tickets</Button>
                      </Box>
                    ))}
                  </VStack>
                ) : <Center py={6}><Text>No upcoming tickets 😕</Text></Center>}
              </TabPanel>
              <TabPanel>
                {pastTickets.length > 0 ? (
                  <List spacing={3}>
                    {pastTickets.map((t) => (
                      <ListItem key={t._id}>{t.event?.eventName} - {t.seatNumber}</ListItem>
                    ))}
                  </List>
                ) : <Center py={6}><Text>No past tickets 📭</Text></Center>}
              </TabPanel>
              <TabPanel>
                {pendingResell.length > 0 ? (
                  <List spacing={3}>
                    {pendingResell.map((t) => (
                      <ListItem key={t._id}>{t.event?.eventName} - LKR {t.resalePrice}</ListItem>
                    ))}
                  </List>
                ) : <Center py={6}><Text>No tickets pending resale</Text></Center>}
              </TabPanel>
              <TabPanel>
                {soldResell.length > 0 ? (
                  <List spacing={3}>
                    {soldResell.map((t) => (
                      <ListItem key={t._id}>{t.event?.eventName} - LKR {t.resalePrice}</ListItem>
                    ))}
                  </List>
                ) : <Center py={6}><Text>No resold tickets</Text></Center>}
              </TabPanel>
              <TabPanel>
                {waitlist.length > 0 ? (
                  <List spacing={3}>
                    {waitlist.map((entry) => (
                      <ListItem key={entry._id}>{entry.eventId?.eventName} - {entry.category}</ListItem>
                    ))}
                  </List>
                ) : <Center py={6}><Text>No waitlist entries</Text></Center>}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>

      {/* Modal for ticket resell */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tickets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEventTickets.map((ticket, i) => (
              <Box key={ticket._id} mb={4}>
                <Text><strong>Seat:</strong> {ticket.seatNumber}</Text>
                <Text><strong>Category:</strong> {ticket.category}</Text>
                <Text><strong>Price:</strong> LKR {ticket.ticketPrice}</Text>
                <Textarea mt={2} placeholder="Reason for resale" value={resellReason} onChange={(e) => setResellReason(e.target.value)} />
                <Button mt={2} colorScheme="purple" size="sm" onClick={() => handleResell(ticket)}>Resell Ticket</Button>
                {i !== selectedEventTickets.length - 1 && <Divider my={4} />}
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Account</AlertDialogHeader>
            <AlertDialogBody>This cannot be undone. Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteProfile} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Profile;
