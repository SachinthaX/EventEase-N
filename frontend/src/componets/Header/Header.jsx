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
import { FiMenu, FiUser } from 'react-icons/fi';
import { MdOutlineEventNote } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(AuthContext);

  const linkColor = useColorModeValue('gray.100', 'gray.100');
  const linkHover = useColorModeValue('teal.200', 'teal.300');
  const bgBlur = useColorModeValue('rgba(20, 20, 40, 0.75)', 'rgba(20, 20, 40, 0.85)');
  const brandGradient = "linear(to-r, teal.400, purple.500)";

  const navLinks = [
    { name: 'Events', path: '/upcoming-events' },
    { name: 'Create Event', path: '/create-event', isCTA: true, adminOnly: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

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
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }} alignItems="center">
          {navLinks.map((link, index) => {
            if (link.adminOnly && user?.role !== 'admin') return null;

            return link.isCTA ? (
              <Button
                key={index}
                as={RouterLink}
                to={link.path}
                size="sm"
                px={5}
                bgGradient="linear(to-r, purple.500, teal.400)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, teal.500, purple.600)' }}
                rounded="full"
                shadow="md"
              >
                {link.name}
              </Button>
            ) : (
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
            );
          })}

          {/* ✅ Conditional Login/Profile Button */}
          {user?.token ? (
            <Button
              as={RouterLink}
              to="/profile"
              size="sm"
              leftIcon={<FiUser />}
              bg="white"
              color="teal.500"
              _hover={{ bg: "teal.50", boxShadow: "md" }}
              rounded="full"
              px={5}
            >
              Profile
            </Button>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              size="sm"
              leftIcon={<FiUser />}
              bg="white"
              color="teal.500"
              _hover={{ bg: "teal.50", boxShadow: "md" }}
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
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center">
              <MdOutlineEventNote size={24} style={{ marginRight: '8px' }} />
              <Text fontWeight="bold" fontSize="xl">
                EventEase
              </Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={5} mt={6}>
              {navLinks.map((link, index) => {
                if (link.adminOnly && user?.role !== 'admin') return null;

                return link.isCTA ? (
                  <Button
                    key={index}
                    as={RouterLink}
                    to={link.path}
                    colorScheme="purple"
                    w="full"
                    onClick={onClose}
                    rounded="full"
                  >
                    {link.name}
                  </Button>
                ) : (
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
                );
              })}

              {/* ✅ Conditional Login/Profile Button in Mobile Drawer */}
              {user?.token ? (
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

export default Header;
