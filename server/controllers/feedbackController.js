import Feedback from "../models/Feedback.js";

export const createFeedback=async(req,res)=>{
    const {sessionId,tutorId,rating,comment}=req.body;
    const studentId=req.user.userId;

    try {
        
    } catch (error) {
        const existing=await Feedback.findOne({session:sessionId,student:studentId});
        if(existing){
            return res.status(400).json({ message: "Feedback already submitted for this session." });
        }
        const feedback=new Feedback({
            session:sessionId,
            student:studentId,
            tutor:tutorId,
            rating:rating,
            comment:comment
        });
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully." });
    }
}

export const getTutorFeedback=async(req,res)=>{
    try {
    const feedback = await Feedback.find({ tutor: req.params.tutorId })
      .populate('student', 'name email')
      .populate('session', 'date subject');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
}
