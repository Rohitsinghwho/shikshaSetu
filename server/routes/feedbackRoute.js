import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js';
import {createFeedback,getTutorFeedback} from '../controllers/feedbackController.js';
const router = express.Router();

router.post('/', authenticate,createFeedback);
router.get('/tutor/:tutorId', authenticate,getTutorFeedback);
export default router;