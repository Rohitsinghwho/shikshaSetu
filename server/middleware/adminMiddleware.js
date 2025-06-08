
export  const isAdmin=(req,res,next)=>{
    if(req,user&&req.user.user.isAdmin){
        next()
    }else{
        res.status(400).json({msg:"Access denied"});
    }
}
