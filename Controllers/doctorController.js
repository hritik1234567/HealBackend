const Doctor = require("../model/doctor");



 // Make sure this path is correct

// GET all doctors
 const doctorController=async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const doctors = await Doctor.find({
        $or: [
            { Name: { $regex: searchQuery, $options: 'i' } },
            { Speciality: { $regex: searchQuery, $options: 'i' } },
            { Location: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getDoctor=async (req, res, next)=>{
    let doctor;
    try {
      doctor = await Doctor.findOne({ doctor_id: req.params.id });
      if (doctor == null) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
  };
  

module.exports = {
    doctorController,getDoctor
};
