import User from '../models/Users.js'
import jwt from 'jsonwebtoken';


export const register=async(req,res)=>{
    const {name,email,password,role,subjects,availability,languages}=req.body;
    try {
        // check for existing user
        const existingUser= await User.findOne({email})

        if(existingUser){
            return res.status(400).json({msg:'Email already Registered'});
        }
        const user=new User({
            name,
            email,
            password,
            role,
            subjects,
            availability,
            languages
        });
        await user.save();
        res.status(200).json({msg:'User Registered Successfully'});
    } catch (err) {
        res.status(400).json({msg:"Error in Registering User",error:err.message});
    }
}


export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        // first check if user present or not in db?

        const user= await User.findOne({email});
        if(!user)return res.status(400).json({msg:"Invalid Username or password"});
        const isMatched= await user.comparePassword(password);
        if(!isMatched)return res.status(400).json({msg:"password is Invalid"});

        const Token= user.GenerateToken();
        const options={
            httpOnly:true,
            secure:true,
            sameSite:'Strict',
            maxAge:24*60*60*1000
        }
        res.cookie('token',Token,options);
        res.status(200).json({
            msg:"User Logged In Successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                subjects:user.subjects,
                languages:user.languages
            }
        })
    } catch (error) {
        return res.status(400).json({msg:"Error in Logging In User",error:error.message});

    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', { 
            httpOnly: true,
            secure:true,
            sameSite: 'Strict',
        });
        
        res.status(200).json({ msg: "Logged Out Successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ msg: "Error during logout", error: error.message });
    }
};