const express=require('express')

const {doctorController,getDoctor,searchController}=require('../Controllers/doctorController')
const router=express.Router()


router.get('/',doctorController);

router.get('/:id', getDoctor);


//

//
module.exports = router;