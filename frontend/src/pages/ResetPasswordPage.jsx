// src/pages/ResetPasswordPage.jsx
import {
    Box, Heading, Input, Button, VStack, Text, useToast, FormControl, FormLabel,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from '../services/axios';
  
  const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`/api/auth/reset-password/${token}`, { password });
        toast({ title: 'Password reset successfully', status: 'success' });
        navigate('/login');
      } catch (err) {
        toast({ title: 'Error resetting password', status: 'error' });
      }
    };
  
    return (
      <Box maxW="md" mx="auto" mt={12} p={8} borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center">Reset Your Password</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">Reset Password</Button>
          </VStack>
        </form>
      </Box>
    );
  };
  
  export default ResetPasswordPage;
  