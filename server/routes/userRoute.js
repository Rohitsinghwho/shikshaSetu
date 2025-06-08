import express from 'express'
import {authenticate} from '../middleware/authMiddleware.js'
const router=express.Router();
import {getUserProfile,UpdateUserProfile} from '../controllers/userController.js';

router.get('/:id',authenticate,getUserProfile);
router.put('/:id',authenticate,UpdateUserProfile);

export default router;