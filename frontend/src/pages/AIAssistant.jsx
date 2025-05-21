// frontend/src/pages/AIAssistant.jsx

import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  HStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setMessages([...messages, { sender: "user", text: prompt }]);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.message || "AI error", status: "error" });
        return;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (err) {
      toast({ title: "Failed to contact AI", status: "error" });
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="2xl"
      boxShadow="xl"
      maxW="4xl"
      mx="auto"
      mt={12}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        🤖 Ticket Resale Assistant
      </Text>

      <VStack spacing={4} align="stretch" maxH="60vh" overflowY="auto" mb={6}>
        {messages.map((msg, i) => (
          <HStack
            key={i}
            alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
            bg={msg.sender === "user" ? "teal.100" : "gray.100"}
            px={4}
            py={3}
            borderRadius="xl"
            spacing={3}
            maxW="80%"
            align="start"
          >
            <Icon
              as={msg.sender === "user" ? FaUser : FaRobot}
              boxSize={4}
              color={msg.sender === "user" ? "teal.600" : "gray.600"}
              mt={1}
            />
            <Box fontSize="sm">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </Box>
          </HStack>
        ))}
      </VStack>

      <Divider mb={4} />

      <HStack>
        <Input
          placeholder="Ask something like: How do I resell my ticket?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          isDisabled={loading}
          variant="filled"
        />
        <Button
          onClick={sendPrompt}
          colorScheme="teal"
          isLoading={loading}
          loadingText="Sending..."
        >
          Ask
        </Button>
      </HStack>
    </Box>
  );
};

export default AIAssistant;
