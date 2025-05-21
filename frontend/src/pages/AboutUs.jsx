import { Box, Heading, Text, VStack, SimpleGrid, Avatar, Container } from "@chakra-ui/react";

const teamMembers = [
  {
    name: "Randunu Dissanayake",
    role: "Founder & CEO",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Sachintha Rajapaksha",
    role: "Lead Developer",
    image: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Nadun Dilshan",
    role: "Event Coordinator",
    image: "https://i.pravatar.cc/150?img=48",
  },
];

export default function AboutUs() {
  return (
    <Box py={10} px={4} bg="gray.50" minH="100vh">
      <Container maxW="6xl">
        <VStack spacing={8} align="start">
          {/* Hero Section */}
          <Box>
            <Heading size="2xl" mb={4}>
              About EventEase
            </Heading>
            <Text fontSize="lg" color="gray.700">
              EventEase is your modern solution for seamless event planning. From managing guests to organizing schedules, we bring everything you need into one powerful platform.
            </Text>
          </Box>

          {/* Our Story */}
          <Box>
            <Heading size="lg" mb={3}>
              Our Story
            </Heading>
            <Text color="gray.600">
              EventEase was born from a passion for simplifying complex event workflows. What started as a college project is now a full-fledged platform trusted by thousands. We believe in making event planning stress-free, smart, and scalable.
            </Text>
          </Box>

          {/* Our Mission */}
          <Box>
            <Heading size="lg" mb={3}>
              Our Mission
            </Heading>
            <Text color="gray.600">
              To empower event organizers with intuitive tools and real-time collaboration so that every event — big or small — can be managed with ease and confidence.
            </Text>
          </Box>

          {/* Meet the Team */}
          <Box w="full">
            <Heading size="lg" mb={6}>
              Meet the Team
            </Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {teamMembers.map((member, index) => (
                <VStack key={index} bg="white" p={5} borderRadius="lg" boxShadow="md" spacing={3}>
                  <Avatar size="xl" src={member.image} name={member.name} />
                  <Text fontWeight="bold">{member.name}</Text>
                  <Text color="gray.500">{member.role}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
