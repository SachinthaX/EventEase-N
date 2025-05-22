import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Route imports
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/EventRoutes.js';
import ticketRoutes from './routes/TicketRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import waitlistRoutes from './routes/WaitlistRoutes.js';

// Config and middleware
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';



dotenv.config();
connectDB();

const app = express();

// CORS - allow frontend access
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true,
}));

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Sessions for passport (optional, mainly if using persistent login)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

// Passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session()); // if using sessions with OAuth

// Routes
app.get('/', (req, res) => res.send('Server is running 🚀'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/waitlist', waitlistRoutes);

app.use("/api/ai", aiRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
