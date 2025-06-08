import Sessions from "../models/Sessions.js";
/**
 * 
 * @param {Object} req - express object with user info
 * @param {import("mongoose").ObjectId} req.body.tutor- tutor id
 * @param {String} req.body.subject - subject to study
 * @param {Date} req.body.scheduledTime - Date and time in ISO String format
 * @param {Object} res - Session Object
 */
export const createSession=async(req,res)=>{
    try {
    const {tutor,subject, scheduledTime}= req.body;
    const newSession= new Sessions({
        tutor,
        student:req.user.userId,
        subject,
        scheduledTime
    });
    await newSession.save();
    res.status(200).json(newSession);
        
    } catch (err) {
         res.status(500).json({ message: 'Failed to create session', error: err.message });
    }
}
/** 
@param {Object} req- Express request object
@param {Object} req.query.role - role refers to student or tutor
**/
export const getSession= async(req,res)=>{
    const {role}= req.query;
    try {
        let session;
        if(role=='student'){
            session= await Sessions.find({student:req.user.userId}).populate('tutor','name email');
        }else if(role=='tutor'){
            session=await Sessions.find({tutor:req.user.userId}).populate('student','name email');
        }
        else{
            return res.status(400).json({msg:"Role must be either student or tutor"});
        }
        res.status(200).json(session);
    } catch (err) {
         res.status(500).json({ message: 'Failed to fetch session', error: err.message });
    }
}
/**
 * Updates the status of a session.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Parameters from the route
 * @param {string} req.params.id - The ID of the session to update
 * @param {Object} req.body - The request body
 * @param {string} req.body.status - The new status of the session
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const updateSessionStatus=async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body;
    try {
        const session= await Sessions.findById(id);
        if(!session)return res.status(404).json({msg:"Session not found"});
        if(session.tutor.toString()!==req.user.userId){
            return res.status(403).json({msg:"Unauthorized"});
        }
        session.status=status;
        await session.save();
        res.status(200).json({msg:"Session Status Updated",session});
    } catch (err) {
         res.status(500).json({ message: 'Failed to Update session', error: err.message });
    }
}
/**
 * 
 * @param {Object} req - express request object
 * @param {import("mongoose").ObjectId} req.params.id - Session id
 * @param {String} req.body.feedback - comments on session
 * @param {Number} req.body.rating - Rating on session
 * @param {Object} res 
 * @returns 
 */
export const SubmitFeedbackAndRating=async(req,res)=>{
    const {id}=req.params;
    const {feedback,rating}=req.body;
    try {
    const session = await Sessions.findById(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.student.toString() !== req.user.userId.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    session.feedback = feedback;
    session.rating = rating;
    await session.save();
    res.json({ message: 'Feedback submitted', session });
    } catch (err) {
         res.status(500).json({ message: 'Failed to Submit session feedback', error: err.message });
        
    }
}

export const getUserSession=async(req,res)=>{
    try {
    const userId = req.user.userId; // Get the ID of the authenticated user from the request

    // Find sessions where the user is either the student OR the tutor
    const sessions = await Sessions.find({
      $or: [
        { student: userId },
        { tutor: userId }
      ]
    })
    .populate('student', 'name email') // Populate student details (name, email)
    .populate('tutor', 'name email');  // Populate tutor details (name, email)
    if(!sessions){
        res.status(200).json([]);
    }
    res.status(200).json(sessions);
    } catch (error) {
         res.status(500).json({ message: 'Failed to get Sessions', error: err.message });
        
    }
}