import express from 'express';
import {
  getUserProfile,
  updateProfile,
  updatePassword,
  deleteOwnAccount,
  getAllUsers,
  deleteUser,
  updateUserRole,
  createUserByAdmin,
  updateUserByAdmin
} from '../controllers/userController.js';

import {
  protect,
  authenticate,
  authorizeAdmin,
  adminOnly
} from '../middleware/authMiddleware.js';

const router = express.Router();

/*
  👤 Regular user routes (must be authenticated)
*/
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/profile', protect, deleteOwnAccount);

/*
  🔐 Admin-only routes
*/
router.get('/admin', protect, adminOnly, getAllUsers);
router.delete('/admin/:id', protect, adminOnly, deleteUser);
router.post('/admin', protect, adminOnly, createUserByAdmin);
router.put('/admin/:id/role', protect, adminOnly, updateUserRole);
router.put('/admin/:id', protect, adminOnly, updateUserByAdmin);

/*
  🛠 Legacy Admin Routes (if still used in EventEase Dashboard)
*/
router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);

export default router;
