import passport from 'passport';
import { Router } from 'express';
import { loginUser, registerUser, verifyEmail } from '../controllers/authController.js';
import { googleCallback } from '../controllers/googleController.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/verify-email/:token', verifyEmail);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);


export default router;
