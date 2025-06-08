// backend/models/Notification.js
import mongoose from 'mongoose'


const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,  // e.g., 'reminder', 'announcement', 'system'
    default: 'system',
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
