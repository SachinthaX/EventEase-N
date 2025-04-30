// src/pages/ForgotPasswordPage.jsx
import {
    Box, Heading, Input, Button, VStack, Text, useToast, FormControl, FormLabel,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import axios from '../services/axios';
  
  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('/api/auth/forgot-password', { email });
        setSubmitted(true);
        toast({ title: 'Reset link sent!', status: 'success' });
      } catch (err) {
        toast({
          title: 'Error',
          description: err?.response?.data?.message || 'Something went wrong',
          status: 'error',
        });
      }
    };
  
    return (
      <Box maxW="md" mx="auto" mt={12} p={8} borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center">Forgot Password</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">Send Reset Link</Button>
          </VStack>
        </form>
        {submitted && (
          <Text mt={4} fontSize="sm" color="blue" textAlign="center">
            A reset link has been sent. Please check your email.
          </Text>
        )}
      </Box>
    );
  };
  
  export default ForgotPassword;
  