const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  
  doctor_id: { type: Number, required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
  //patientContact: { type: String, required: true },
  appointmentTime: { type: Date, required: true },
});


const Appointment=mongoose.model('appointment',appointmentSchema);
module.exports=Appointment;