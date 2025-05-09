import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';

const ContactUs = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: 'Message Sent!',
      description: 'We have received your message and will get back soon.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box bg="gray.50" py={20} minH="100vh">
      <Container maxW="lg" bg="white" p={10} rounded="xl" boxShadow="lg">
        <Heading
          textAlign="center"
          mb={6}
          bgGradient="linear(to-r, teal.400, purple.500)"
          bgClip="text"
        >
          Contact Us
        </Heading>

        <Text mb={6} color="gray.600" textAlign="center">
          Have a question, feedback, or suggestion? We'd love to hear from you!
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                rows={5}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="full"
              bgGradient="linear(to-r, teal.400, purple.500)"
              _hover={{ bgGradient: 'linear(to-r, purple.500, teal.400)' }}
              color="white"
              rounded="full"
            >
              Send Message
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
};

export default ContactUs;
