// src/pages/LoginPage.jsx
import {
  Box, Heading, Input, Button, VStack, Text, useToast, FormControl,
  FormLabel, InputGroup, InputRightElement, FormErrorMessage, Checkbox, Flex
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data, rememberMe); // pass rememberMe to auth context
      toast({ title: 'Login successful!', status: 'success', duration: 2000 });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error?.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
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
      <Heading mb={6} textAlign="center" fontSize="2xl">Welcome Back to EventEase</Heading>

      <form onSubmit={handleLogin}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <InputRightElement width="4.5rem">
                <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Flex justify="space-between" align="center" w="100%">
            <Checkbox isChecked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
              Remember me
            </Checkbox>
            <Button variant="link" colorScheme="blue" size="sm" onClick={() => navigate('/forgot-password')}>
              Forgot password?
            </Button>
          </Flex>

          {/* <Button colorScheme="blue" type="submit" width="full" isLoading={loading}>
            Sign In
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
              Sign In
            </Button>

          <Button size="lg" rounded="full" variant="outline" width="full" onClick={handleGoogleLogin} leftIcon={
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
          }>
            Sign in with Google
          </Button>

          <Text fontSize="sm">
            Don’t have an account?{' '}
            <Button variant="link" colorScheme="blue" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
    </Flex>
  );
};

export default Login;
