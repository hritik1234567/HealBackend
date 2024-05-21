const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
doctor_id:{type:Number,required:true},
  name: { type: String, required: true },
  specialization: String,
  location: String,
  rating: Number,
  phoneNumber: Number,
  gender: String,
  fees: Number,
  
});

const Doctor=mongoose.model('doctor',doctorSchema);
module.exports=Doctor;

