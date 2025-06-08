// backend/models/Session.js
import mongoose from 'mongoose'


const sessionSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  feedback: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default:null
  },
  description:{
    type:String,
    required:true
  }

}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
