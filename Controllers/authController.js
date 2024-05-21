const { hashpassword, comparepassword } = require("../Helper/authhelper");
const patientModel = require("../model/patient");
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        const { name, email, age, password, confirmPassword, phoneNumber } = req.body;

        if (!name) return res.send({ message: "Name is required" });
        if (!email) return res.send({ message: "Email is required" });
        if (!age) return res.send({ message: "Age is required" });
        if (!password) return res.send({ message: "Password is required" });
        if (confirmPassword !== password) return res.send({ message: "Confirm Password does not match" });
        if (!phoneNumber) return res.send({ message: "Phone Number is required" });

        const existingUser = await patientModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered',
            });
        }

        const hashedPassword = await hashpassword(password);
        const patient = new patientModel({ name, email, age, password: hashedPassword, phoneNumber: phoneNumber }).save();

        res.status(201).send({
            success: true,
            message: "User Registered successfully",
            patient
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Invalid Patient Details",
            });
        }

        const patient = await patientModel.findOne({ email });
        if (!patient) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered.',
            });
        }

        const match = await comparepassword(password, patient.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Incorrect details",
            });
        }

        const token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).send({
            success: true,
            message: "Login successfully",
            patient: {
                _id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        });
    }
};

module.exports = {
    registerController,
    loginController,
};
