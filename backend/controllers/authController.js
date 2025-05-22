// controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const verificationToken = crypto.randomBytes(20).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: verificationToken
  });

  // Send email verification
  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}?email=${email}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email',
    text: `Click to verify your email: ${verifyLink}`
  });

  res.status(201).json({ message: 'Verification email sent' });
});

// Login

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email before logging in.');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user); // ✅ FIX: use `user` not `req.user`

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
});


// Verify Email

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const email = req.query.email;
  console.log('Token received:', token);

  const user = await User.findOne({ email, emailVerificationToken: token });

  // Already verified?
  if (!user) {
    const alreadyVerified = await User.findOne({ isVerified: true });
    if (alreadyVerified) {
      return res.status(200).json({
        message: 'Email already verified',
        token: generateToken(alreadyVerified._id),
        name: alreadyVerified.name,
        email: alreadyVerified.email,
      });
    }

    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.json({
    message: 'Email verified successfully',
    token: generateToken(user._id),
    name: user.name,
    email: user.email,
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password',
    text: `Click here to reset your password: ${resetLink}`
  });

  res.json({ message: 'Password reset email sent' });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});
