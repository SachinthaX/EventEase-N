import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import qs from 'qs';
import { Spinner, Center } from '@chakra-ui/react';

const OAuthSuccess = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (query.token && query.name && query.email && query.role && query.id) {
      // Avoid calling login repeatedly if user is already set
      if (!user) {
        const userData = {
          _id: query.id,
          name: query.name,
          email: query.email,
          role: query.role,
          token: query.token,
        };

        login(userData, true);
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [location.search]); // ✅ only listen to search, not full location

  return (
    <Center height="80vh">
      <Spinner size="xl" color="teal.400" />
    </Center>
  );
};

export default OAuthSuccess;
