import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Link as ChakraLink,
    useColorModeValue,
    Text,
  } from '@chakra-ui/react';
  import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
  import { MdAdminPanelSettings } from 'react-icons/md';
  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  import { useContext } from 'react';
  import { AuthContext } from '../../context/AuthContext';
  
  const adminLinks = [
    { name: 'Dashboard', path: '/all-events' },
    { name: 'Create Event', path: '/create-event' },
    { name: 'Manage Users', path: 'admin/manage-users' },
    { name: 'Feedback', path: '/admin/feedback' },
  ];
  
  const AdminHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/');
    };
  
    const linkColor = useColorModeValue('gray.100', 'gray.100');
    const linkHover = useColorModeValue('teal.200', 'teal.300');
    const bgBlur = useColorModeValue('rgba(20, 20, 40, 0.75)', 'rgba(20, 20, 40, 0.85)');
    const brandGradient = "linear(to-r, teal.400, purple.500)";
  
    return (
      <Box position="sticky" top="0" zIndex="sticky" bg={bgBlur} backdropFilter="blur(12px)" boxShadow="sm">
        <Flex align="center" justify="space-between" px={{ base: 4, md: 10 }} py={4} maxW="7xl" mx="auto">
          {/* Admin Brand Logo */}
          <ChakraLink
            as={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            fontWeight="bold"
            fontSize="2xl"
            bgGradient={brandGradient}
            bgClip="text"
          >
            <MdAdminPanelSettings size={28} style={{ marginRight: '8px' }} />
            Admin Panel
          </ChakraLink>
  
          {/* Desktop Nav */}
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            {adminLinks.map((link, index) => (
              <ChakraLink
                key={index}
                as={RouterLink}
                to={link.path}
                fontWeight="medium"
                fontSize="sm"
                color={linkColor}
                _hover={{ color: linkHover }}
              >
                {link.name}
              </ChakraLink>
            ))}
            <Button
              leftIcon={<FiLogOut />}
              size="sm"
              colorScheme="red"
              onClick={handleLogout}
              rounded="full"
            >
              Logout
            </Button>
          </HStack>
  
          {/* Mobile Nav Icon */}
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Toggle Menu"
            onClick={onOpen}
            color="white"
            display={{ base: 'flex', md: 'none' }}
          />
        </Flex>
  
        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="gray.800" color="white">
            <DrawerCloseButton />
            <DrawerHeader>
              <Flex align="center">
                <MdAdminPanelSettings size={24} style={{ marginRight: '8px' }} />
                <Text fontWeight="bold">Admin Panel</Text>
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing={5} mt={4}>
                {adminLinks.map((link, index) => (
                  <ChakraLink
                    key={index}
                    as={RouterLink}
                    to={link.path}
                    fontSize="md"
                    fontWeight="medium"
                    _hover={{ color: 'teal.300' }}
                    onClick={onClose}
                  >
                    {link.name}
                  </ChakraLink>
                ))}
                <Button
                  leftIcon={<FiLogOut />}
                  colorScheme="red"
                  onClick={() => {
                    onClose();
                    handleLogout();
                  }}
                  rounded="full"
                >
                  Logout
                </Button>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };
  
  export default AdminHeader;
  