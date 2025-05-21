import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import UpcomingEvents from "./UpcomingEvents";

const Home = () => {
  const gradient = useColorModeValue(
    "linear(to-r, teal.400, purple.500)",
    "linear(to-r, teal.300, purple.400)"
  );

  const [systemFeedbacks, setSystemFeedbacks] = useState([]);

  useEffect(() => {
    const fetchSystemFeedback = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/feedback");


        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Expected array but got:", data);
          return;
        }

        const systemOnly = data.filter((fb) => fb.type === "system");
        setSystemFeedbacks(systemOnly);
      } catch (err) {
        console.error("Failed to fetch system feedback", err);
      }
    };

    fetchSystemFeedback();
  }, []);

  const imageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image%20(1).webp?alt=media&token=0377c613-b64b-4446-903b-c9550418a133",
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image%20(2).webp?alt=media&token=d15c5d12-fd69-4d20-9a26-cd171acb6185",
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image.webp?alt=media&token=7bae603b-61df-4a05-bd86-bf61b38fda4c",
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image%20(3).webp?alt=media&token=76d33c10-7d70-4826-9807-7b682482c16b",
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image%20(4).webp?alt=media&token=41027c6f-2553-43ff-a348-9c0be87af5e3",
    "https://firebasestorage.googleapis.com/v0/b/image-storage-e9071.firebasestorage.app/o/image%20(5).webp?alt=media&token=1fc6616c-5f19-443e-9220-db70a3c1268c",
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient={gradient} color="white" py={{ base: 20, md: 28 }} textAlign="center">
        <Container maxW="7xl">
          <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" mb={4}>
            Welcome to EventEase
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} mb={6}>
            Your one-stop solution for seamless event management.
          </Text>
          <Button
            as={RouterLink}
            to="/upcoming-events"
            size="lg"
            colorScheme="whiteAlpha"
            bg="white"
            color="teal.600"
            _hover={{ bg: "gray.100" }}
            fontWeight="bold"
          >
            Explore Events
          </Button>
        </Container>
      </Box>

      {/* Event Highlights */}
      <Box py={16} bg={useColorModeValue("gray.50", "gray.800")}> 
        <Container maxW="6xl">
          <Heading textAlign="center" size="xl" mb={8} color="teal.600">
            Event Highlights
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Event Image ${index + 1}`}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
              />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Box py={20} bg={useColorModeValue("gray.50", "gray.800")}> 
        <Container maxW="6xl">
          <Heading textAlign="center" size="xl" mb={10} color="teal.600">
            Upcoming Events
          </Heading>
          <UpcomingEvents />
        </Container>
      </Box>

      {/* System Feedback Section */}
      <Box py={20} bg={useColorModeValue("white", "gray.900")}> 
        <Container maxW="6xl">
          <Heading textAlign="center" size="xl" mb={10} color="teal.600">
            What Users Say About EventEase
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {systemFeedbacks.slice(0, 6).map((fb) => (
              <Box
                key={fb._id}
                p={6}
                bg="gray.50"
                borderRadius="lg"
                boxShadow="lg"
                _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
              >
                <Text fontSize="sm" color="gray.500">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </Text>
                <Text fontWeight="bold" color="teal.600" mb={2}>
                  {"★".repeat(fb.rating)}
                </Text>
                <Text fontSize="md" color="gray.700">
                  {fb.comment}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={24} textAlign="center" bgGradient="linear(to-r, purple.500, teal.500)" color="white">
        <Container maxW="7xl">
          <Heading fontSize={{ base: "2xl", md: "4xl" }} mb={4}>
            Join the EventEase Community
          </Heading>
          <Text fontSize="lg" mb={6}>
            Stay connected with your audience and grow your event's impact.
          </Text>
          <Button
            as={RouterLink}
            to="/events"
            size="lg"
            colorScheme="whiteAlpha"
            variant="outline"
            borderColor="white"
            _hover={{ bg: "whiteAlpha.300" }}
            rounded="full"
          >
            Start Organizing
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
