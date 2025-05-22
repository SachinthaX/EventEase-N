import { StrictMode } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { MotionConfig } from 'framer-motion'
import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; 


createRoot(document.getElementById("root")).render(
  <AuthProvider>  
      <ChakraProvider>
      <MotionConfig reducedMotion="user">

      <App />

      </MotionConfig>
  </ChakraProvider>
    </AuthProvider>
);
