// backend/models/Message.js
import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({
  chatRoomId: {            // Identifier for conversation (can be combination of tutorId + studentId)
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);


// Optional: You can create a ChatRoom model to manage chat sessions if you want to expand the messaging system later.
