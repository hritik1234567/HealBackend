const express=require('express')
const { appointmentController,myappointmentController } = require('../Controllers/appointmentController');
const router=express.Router()


router.post('/booking',appointmentController);
router.post('/myappointment',myappointmentController);

//

//
module.exports = router;