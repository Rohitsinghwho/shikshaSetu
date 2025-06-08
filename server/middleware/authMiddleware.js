import jwt from 'jsonwebtoken'

export  const authenticate= (req,res,next)=>{
    // const authHeader= req.cookies?.token;
    const authHeader = req.cookies?.token;
    if (!authHeader) return res.status(401).json({ msg: "No token provided in Authorization header" });
    // console.log(authHeader)
    try {
        const decoded= jwt.verify(authHeader,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token has expired" });
        }
        res.status(400).json({msg:"Invalid or expired Token"});
    }

};