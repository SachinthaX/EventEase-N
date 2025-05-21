import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Heading,
  Input,
  Button,
  IconButton,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaArrowRight,
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const brandGradient = useColorModeValue(
    'linear(to-r, teal.400, purple.500)',
    'linear(to-r, teal.300, purple.400)'
  );

  const sectionTitleColor = useColorModeValue('gray.100', 'gray.200');
  const linkHover = useColorModeValue('teal.200', 'teal.300');
  const bg = useColorModeValue('gray.900', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  return (
    <Box bg={bg} color="gray.300" pt={16} pb={8}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          {/* Brand Info */}
          <Stack spacing={4}>
            <Heading
              size="md"
              bgGradient={brandGradient}
              bgClip="text"
              fontWeight="extrabold"
            >
              EventEase
            </Heading>
            <Text fontSize="sm">
              Your trusted partner for smart and smooth event management.
              Plan, manage, and succeed — all in one platform.
            </Text>
            <Stack direction="row" spacing={3} mt={2}>
              <IconButton
                as="a"
                href="#"
                aria-label="Facebook"
                icon={<FaFacebook />}
                variant="ghost"
                colorScheme="teal"
                _hover={{ bg: 'teal.600' }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="Twitter"
                icon={<FaTwitter />}
                variant="ghost"
                colorScheme="teal"
                _hover={{ bg: 'teal.600' }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                colorScheme="teal"
                _hover={{ bg: 'teal.600' }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                variant="ghost"
                colorScheme="teal"
                _hover={{ bg: 'teal.600' }}
              />
            </Stack>
          </Stack>

          {/* Quick Links */}
          <Stack align="flex-start">
            <Heading size="sm" color={sectionTitleColor}>
              Quick Links
            </Heading>
            <chakra.a as={RouterLink} to="/events" _hover={{ color: linkHover }}>
              Browse Events
            </chakra.a>
            <chakra.a as={RouterLink} to="/create-event" _hover={{ color: linkHover }}>
              Create Event
            </chakra.a>
            <chakra.a as={RouterLink} to="/about" _hover={{ color: linkHover }}>
              About Us
            </chakra.a>
            <chakra.a as={RouterLink} to="/contact" _hover={{ color: linkHover }}>
              Support
            </chakra.a>
          </Stack>

          {/* Contact Info */}
          <Stack align="flex-start">
            <Heading size="sm" color={sectionTitleColor}>
              Contact
            </Heading>
            <Text>info@eventease.com</Text>
            <Text>+1 (555) 123-4567</Text>
            <Text>123 Event Street, New York, NY</Text>
          </Stack>

          {/* Newsletter CTA */}
          <Stack spacing={4}>
            <Heading size="sm" color={sectionTitleColor}>
              Stay Updated
            </Heading>
            <Text fontSize="sm">
              Join our newsletter to get the latest updates & offers.
            </Text>
            <Stack direction="row">
              <Input
                placeholder="Your email"
                variant="filled"
                bg="whiteAlpha.100"
                _hover={{ bg: 'whiteAlpha.200' }}
                _placeholder={{ color: 'gray.400' }}
              />
              <IconButton
                colorScheme="teal"
                aria-label="Subscribe"
                icon={<FaArrowRight />}
              />
            </Stack>
          </Stack>
        </SimpleGrid>

        {/* Footer Bottom */}
        <Box borderTop="1px" borderColor={borderColor} mt={12} pt={6} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} EventEase. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
