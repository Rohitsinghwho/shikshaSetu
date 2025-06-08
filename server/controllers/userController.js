import User from '../models/Users.js'

export const getUserProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id).select('-password');
        if(!user)return res.status(404).json({msg:"User Not Found"});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({msg:"Error in Fetching User Profile",error:error.message});
    }
}

export const UpdateUserProfile=async(req,res)=>{
    if(req.user.userId!==req.params.id){
        return res.status(400).json({msg:"Unauthorized to Upadate this profile"});
    }
    
    console.log(req.user.userId);
    try {
        const updatedUser=await User.findByIdAndUpdate(
        req.params.id,    
        {
            $set:req.body
        },
        {
            new:true,
            runValidators:true
        }
    ).select("-password");
    res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({msg:"Error in Updating User Profile",error:error.message});
    }
}