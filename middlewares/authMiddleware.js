const { check } = require("express-validator");
const jwt = require("jsonwebtoken")

const auth = (req,res,next)=>{
const authHeader = req.header("authorization");

if(!authHeader){
    return res.status(404).json({message:"no token ,authorization denied"});
}

const token  = authHeader.toLowerCase().startsWith("bearer")
? authHeader.split(" ")[1]
:null;
if(!token){
return res.status(404).json({message:"token format is invalid"});
}

try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}catch(error){
return res.status(404).json({message:"token is not valid"});
}

}

const checkRole = (roles) =>{
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
 return res.status(403).json({message:"role not found , permission denied"})
        }
          next();
    }
}
module.exports ={auth ,checkRole}