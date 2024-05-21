const express=require('express')
const { registerController, loginController } = require('../Controllers/authController');
const {requireSignin}=require('../middleware/authMiddleware')

const router=express.Router()

router.post('/register',registerController);
router.post('/login',loginController);

router.get("/patient-auth",requireSignin,(req,res)=>{
    res.status(200).send({ok:true});
})
//

//
module.exports = router;