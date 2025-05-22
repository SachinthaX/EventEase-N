import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Load .env
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Middleware to check JWT and attach full user object
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// 🛡️ Optional lightweight middleware (sets req.user with basic info only)
export const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied - no or invalid token format' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token expired. Please log in again.'
        : 'Invalid or expired token';
    return res.status(401).json({ error: message });
  }
};

// 🔒 Admin check — for routes requiring admin role
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// 🔒 Alternate admin check using thrown error (for asyncHandler)
export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access required');
  }
};
