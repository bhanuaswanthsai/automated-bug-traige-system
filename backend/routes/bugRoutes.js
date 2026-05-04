import express from 'express';
import { getBugs, getBugById, createBug, updateBug, addComment, getComments, getAnalytics } from '../controllers/bugController.js';
import { protect, admin, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBugs)
  .post(protect, authorizeRoles('Tester', 'Admin'), createBug);

router.get('/analytics', protect, authorizeRoles('Admin'), getAnalytics);

router.route('/:id')
  .get(protect, getBugById)
  .put(protect, authorizeRoles('Developer', 'Admin'), updateBug);

router.route('/:id/comments')
  .get(protect, getComments)
  .post(protect, addComment);

export default router;
