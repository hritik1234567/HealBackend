require('dotenv').config(); // Load environment variables
const appointmentModel = require("../model/appointment");
const Patient = require("../model/patient");
const twilio = require('twilio');
const events = require('events');

// Increase the limit of event listeners to avoid warnings
events.EventEmitter.defaultMaxListeners = 20;

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const validateAndFormatPhoneNumber = (phoneNumber) => {
    // Regular expression for a valid 10 digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(phoneNumber)) {
        // Assuming the country code is +91 for India
        return `+91${phoneNumber}`;
    }
    return null;
};

const appointmentController = async (req, res) => {
    try {
        const { doctor_id, patient_id, appointmentTime } = req.body;
        if (!doctor_id) return res.status(400).send({ message: "Doctor_id is required" });
        if (!patient_id) return res.status(400).send({ message: "patient_id is required" });
        if (!appointmentTime) return res.status(400).send({ message: "Time is required" });

        const patient = await Patient.findById(patient_id);
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }

        const patientContact = patient.phoneNumber;
        const formattedContact = validateAndFormatPhoneNumber(patientContact);
        if (!formattedContact) {
            return res.status(400).send({ message: "Valid patient contact number is required" });
        }

        const existingAppointment = await appointmentModel.findOne({ doctor_id, patient_id, appointmentTime });
        if (existingAppointment) {
            return res.status(200).send({
                success: true,
                message: 'Appointment already exists',
            });
        }

        const appointment = new appointmentModel({ doctor_id, patient_id, appointmentTime });
        await appointment.save();
        
        // Send SMS notification to the patient
        const message = `Your appointment has been booked successfully for ${appointmentTime}`;
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedContact // Ensure the number is in E.164 format
        });

        res.status(201).send({
            success: true,
            message: "Appointment booked successfully and SMS sent",
            appointment
        });

    } catch (error) {
        console.error("Error in appointmentController:", error);
        res.status(500).send({
            success: false,
            message: "Error in appointmentController",
            error: error.message // Log the specific error message
        });
    }
};
const myappointmentController = async (req, res) => {
    try {
        const { patient_id } = req.body;
        if (!patient_id) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const appointments = await appointmentModel.find({ patient_id });
        res.json(appointments);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    appointmentController,myappointmentController
};
