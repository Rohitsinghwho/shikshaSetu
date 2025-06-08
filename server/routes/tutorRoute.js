import express from 'express';
import { MatchTutors,FilterbySubject,getTutor } from '../controllers/tutorController.js';
// import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', MatchTutors);
router.post('/search',FilterbySubject)
router.get('/tutor',getTutor)

export default router