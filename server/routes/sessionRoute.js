import express from 'express'
import {authenticate} from '../middleware/authMiddleware.js'
import {createSession,getSession,updateSessionStatus,SubmitFeedbackAndRating,getUserSession} from '../controllers/sessionController.js'
const router= express.Router();

router.post('/',authenticate,createSession);
router.get('/getUserSession',authenticate,getUserSession);
router.post('/getSession',authenticate,getSession);
router.patch('/:id/status',authenticate,updateSessionStatus);
router.patch('/:id/feedback',authenticate,SubmitFeedbackAndRating)
export default router;