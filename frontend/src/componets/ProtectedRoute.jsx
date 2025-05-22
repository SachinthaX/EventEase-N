// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Center mt={20}><Spinner size="xl" color="teal.400" /></Center>;
  }

  return user?.token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
