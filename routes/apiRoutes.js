const express=require('express')

const {aiController}=require('../Controllers/aiController')
const router=express.Router()


router.post('/answer',aiController);

//

//
module.exports = router;