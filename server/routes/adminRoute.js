import express from 'express';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {getAllUsers,getUserById,getAllFeedbacks,getAllSessions} from '../controllers/adminController.js'
const router=express.Router();
router.get('/users', isAdmin,getAllUsers);
router.get('/users/:id', isAdmin,getUserById);
router.get('/sessions', isAdmin,getAllSessions);
router.get('/feedback', isAdmin,getAllFeedbacks);

export default router;