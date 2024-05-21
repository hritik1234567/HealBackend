const jwt=require('jsonwebtoken');

const requireSignin=async(req,res,next)=>{
    try {
        const decode=jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET,{ expiresIn: '1h' });
            req.patient=decode;
            next();
    } catch (error) {
        console.log(error);
    }
};
module.exports={requireSignin};