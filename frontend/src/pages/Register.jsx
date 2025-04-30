import {
  Box, Heading, Input, Button, VStack, Text, useToast, FormControl,
  FormLabel, FormErrorMessage, Divider, Flex
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post('/api/auth/register', form);
      toast({
        title: 'Account created!',
        description: 'Check your email to verify your account.',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error?.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Flex minH="60vh" align="center" justify="center" bg="gray.50">
      <Box
        maxW="md"
        w="full"
        mt={6}
        mb={6}
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
      <Heading mb={6} textAlign="center" fontSize="2xl">Create your EventEase account</Heading>

      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <FormControl id="name" isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl id="email" isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          {/* <Button colorScheme="blue" type="submit" width="full" isLoading={loading}>
            Sign Up
          </Button> */}
          <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              bgGradient="linear(to-r, teal.400, purple.500)"
              _hover={{ bgGradient: "linear(to-r, purple.500, teal.400)" }}
              color="white"
              rounded="full"
              mt={4}
            >
              Sign Up
            </Button>

          <Button
            variant="outline"
            width="full"
            rounded="full"
            size="lg"
            onClick={handleGoogleSignup}
            leftIcon={
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width="20"
                height="20"
              />
            }
          >
            Sign up with Google
          </Button>

          <Divider />

          <Text fontSize="sm">
            Already have an account?{" "}
            <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
    </Flex>
  );
};

export default Register;
