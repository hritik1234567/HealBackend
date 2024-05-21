const mongoose = require('mongoose');

const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    age:{
        type:Number,
        required:true,

    },
    password:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true
    },

    
},{timestamps:true })

const Patient=mongoose.model('patient',patientSchema);
module.exports=Patient;