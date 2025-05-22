import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { Box, Text, Spinner, Center, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { search } = window.location;
  const email = new URLSearchParams(search).get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(`/api/auth/verify-email/${token}?email=${email}`);
        login(data); // login after verification
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, login]);

  if (status === 'loading') {
    return <Center mt={20}><Spinner size="xl" /></Center>;
  }

  if (status === 'error') {
    return (
      <Center mt={20}>
        <Alert status="error" maxW="md">
          <AlertIcon />
          Invalid or expired verification link.
        </Alert>
      </Center>
    );
  }

  return (
    <Center mt={20}>
      <Box textAlign="center">
        <Alert status="success" mb={4}>
          <AlertIcon />
          Email verified successfully!
        </Alert>
        <Button colorScheme="teal" onClick={() => navigate('/login')} mb={4}>
          Go to Login
          
        </Button>
      </Box>
    </Center>
  );
};

export default VerifyEmailPage;

