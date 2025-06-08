// backend/models/User.js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {    // hashed password
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    required: true,
  },
  subjects: {     // Only for tutors
    type: [String],
  },
  availability: { // Only for tutors, array of time slots or days
    type: [String],
  },
  languages: {    // languages tutor or student prefers (e.g., ["English", "Hindi"])
    type: [String],
  },
  educationLevel: {  // e.g., "primary", "secondary", "higher"  only for students
    type: String,
  },
  rating: {      // Average rating from feedback (for tutors)
    type: Number,
    default: 0,
  },
  sessionsCompleted: {   //only for tut
    type: Number,
    default: 0,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }

}, { timestamps: true });



userSchema.pre('save', async function(next){
  if(!this.isModified('password'))return next()
    try {
  const salt= await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
  
} catch (error) {
  next(error);
}
})
userSchema.methods.GenerateToken=function(){
  return jwt.sign(
    {
      userId:this._id,
      role:this.role
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES}
  )
}
userSchema.methods.comparePassword=async function(candidatePassword){
  return await bcrypt.compare(candidatePassword,this.password);
}

export default mongoose.model('User', userSchema);