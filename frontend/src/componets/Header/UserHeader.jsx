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
  import { MdOutlineEventNote } from 'react-icons/md';
  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  import { useContext } from 'react';
  import { AuthContext } from '../../context/AuthContext';
  
  const navLinks = [
    { name: 'Events', path: '/upcoming-events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const UserHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/');
    };
  
    const linkColor = useColorModeValue('gray.100', 'gray.100');
    const linkHover = useColorModeValue('teal.200', 'teal.300');
    const bgBlur = useColorModeValue('rgba(20, 20, 40, 0.75)', 'rgba(20, 20, 40, 0.85)');
    const brandGradient = 'linear(to-r, teal.400, purple.500)';
  
    return (
      <Box
        position="sticky"
        top="0"
        zIndex="sticky"
        bg={bgBlur}
        backdropFilter="blur(12px)"
        boxShadow="sm"
      >
        <Flex
          align="center"
          justify="space-between"
          px={{ base: 4, md: 10 }}
          py={4}
          maxW="7xl"
          mx="auto"
        >
          {/* Logo */}
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
            <MdOutlineEventNote size={28} style={{ marginRight: '8px' }} />
            EventEase
          </ChakraLink>
  
          {/* Desktop Nav */}
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((link, index) => (
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
  
            {user?.token ? (
              <>
                <Button
                  as={RouterLink}
                  to="/profile"
                  size="sm"
                  leftIcon={<FiUser />}
                  bg="white"
                  color="teal.500"
                  _hover={{ bg: 'teal.50', boxShadow: 'md' }}
                  rounded="full"
                  px={5}
                >
                  Profile
                </Button>
                <Button
                  leftIcon={<FiLogOut />}
                  size="sm"
                  colorScheme="red"
                  onClick={handleLogout}
                  rounded="full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                size="sm"
                leftIcon={<FiUser />}
                bg="white"
                color="teal.500"
                _hover={{ bg: 'teal.50', boxShadow: 'md' }}
                rounded="full"
                px={5}
              >
                Login
              </Button>
            )}
          </HStack>
  
          {/* Mobile Menu Icon */}
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
                <MdOutlineEventNote size={24} style={{ marginRight: '8px' }} />
                <Text fontWeight="bold">EventEase</Text>
              </Flex>
            </DrawerHeader>
  
            <DrawerBody>
              <Stack spacing={5} mt={6}>
                {navLinks.map((link, index) => (
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
  
                {user?.token ? (
                  <>
                    <Button
                      as={RouterLink}
                      to="/profile"
                      leftIcon={<FiUser />}
                      variant="outline"
                      colorScheme="teal"
                      w="full"
                      rounded="full"
                      onClick={onClose}
                    >
                      Profile
                    </Button>
                    <Button
                      leftIcon={<FiLogOut />}
                      colorScheme="red"
                      w="full"
                      onClick={() => {
                        onClose();
                        handleLogout();
                      }}
                      rounded="full"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    as={RouterLink}
                    to="/login"
                    leftIcon={<FiUser />}
                    variant="outline"
                    colorScheme="teal"
                    w="full"
                    rounded="full"
                    onClick={onClose}
                  >
                    Login
                  </Button>
                )}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };
  
  export default UserHeader;
  