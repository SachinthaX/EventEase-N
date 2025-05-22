import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js'; // optional: for email alerts

// 🔐 Login User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 🆕 Register User (manual route)
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, user });
});

// 👤 Get own user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id)
    .select('-password')
    .populate({
      path: 'tickets',
      populate: {
        path: 'event',
        model: 'Event',
      },
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    name: user.name,
    email: user.email,
    wallet: user.wallet,
    tickets: user.tickets,
    role: user.role,
  });
});

// ✏️ Update own profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
  });
});

// 🔐 Change own password
export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const isMatch = await user.matchPassword(req.body.currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

// 🗑️ Delete own account
export const deleteOwnAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.deleteOne({ _id: req.user._id });
  res.json({ message: 'Your account has been deleted' });
});

// 🛠️ Admin: get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Admin - update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = req.body.role;
  await user.save();
  res.json({ message: 'User role updated', role: user.role });
});


// 🛠️ Admin: delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user._id.toString() === user._id.toString()) {
    res.status(403);
    throw new Error('You cannot delete your own account');
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User deleted' });
});

// 🛠️ Admin: create user
export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isVerified: true,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// 🛠️ Admin: update user
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role, password } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  if (password && password.trim().length >= 6) {
    user.password = password;

    await sendEmail({
      to: user.email,
      subject: 'Your EventEase password was changed',
      text: `Hello ${user.name},\n\nYour password was reset by an admin.\n\nIf this wasn't your request, please contact support.`,
    });
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});
