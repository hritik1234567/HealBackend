/*
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
// Create an instance of GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define the aiController function to generate content based on the prompt
const aiController = async function (req, res) {
    try {
        // Get the prompt from the request body
        const { prompt } = req.body;

        // Get the generative model (gemini-pro) for text-only input
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content based on the prompt
        const result = await model.generateContent(prompt);

        // Get the response text from the result
        const response = await result.response;
        const text =  response.text();

        // Send the generated text as the response
        res.status(200).json({ message: text });
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    aiController
};
*/
const { GoogleGenerativeAI } = require("@google/generative-ai");
const csv = require('csv-parser');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Set up GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to read doctor data from CSV
const readDoctorData = () => {
    const doctorData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('doctor.csv')
            .pipe(csv())
            .on('data', (row) => {
                doctorData.push(row);
            })
            .on('end', () => {
                resolve(doctorData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Function to recommend doctors based on user input
const recommendDoctors = async (doctorType, location) => {
    try {
        const doctorData = await readDoctorData();
        const recommendedDoctors = doctorData.filter((doctor) => {
            return doctor.Speciality.toLowerCase() === doctorType.toLowerCase() &&
                doctor.Location.toLowerCase() === location.toLowerCase();
        });
        return recommendedDoctors;
    } catch (error) {
        console.error("Error reading doctor data:", error.message);
        return [];
    }
};

// Define the aiController function to generate content based on the prompt
const aiController = async function (req, res) {
    try {
        // Get the prompt from the request body
        const { prompt,symptom,location } = req.body;

        // Check if the prompt is for doctor recommendation
        if (prompt.includes('recommend doctors')) {
            const [doctorType, location] = prompt.split(' in ')[1].split(' ');
            const recommendedDoctors = await recommendDoctors(doctorType, location);
            const doctorNames = recommendedDoctors.map(doctor => doctor.Name);
            const text = `Recommended doctors in ${location} for ${doctorType}: ${doctorNames.join(', ')}`;
            res.status(200).json({ message: text });
        } else {
            // Get the generative model (gemini-pro) for text-only input
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Generate content based on the prompt
            const result = await model.generateContent(prompt);

            // Get the response text from the result
            const response = await result.response;
            const text = response.text();

            // Send the generated text as the response
            res.status(200).json({ message: text });
        }
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    aiController
}
/*
const  { GoogleGenerativeAI } = require("@google/generative-ai");
const csv = require('csv-parser');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Set up GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to read doctor data from CSV
const readDoctorData = () => {
    const doctorData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('doctor.csv')
            .pipe(csv())
            .on('data', (row) => {
                doctorData.push(row);
            })
            .on('end', () => {
                resolve(doctorData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Function to recommend doctors based on user input
const recommendDoctors = async (doctorType, location) => {
    try {
        const doctorData = await readDoctorData();
        const recommendedDoctors = doctorData.filter((doctor) => {
            return doctor.Speciality.toLowerCase() === doctorType.toLowerCase() &&
                doctor.Location.toLowerCase() === location.toLowerCase();
        });
        return recommendedDoctors;
    } catch (error) {
        console.error("Error reading doctor data:", error.message);
        return [];
    }
};

// Define the aiController function to generate content based on the prompt
const aiController = async function (req, res) {
    // List of specialities
    

    try {
        // Get the prompt, symptom, and location from the request body
        const { prompt, symptom, location } = req.body;
        const specialities = [
            "Diabetologist",
            "Dermatologist",
            "Dentist",
            "ENT",
            "General Physician",
            "Homeopath"
        ];
        // Check if the request is for doctor recommendation based on symptoms
        if (symptom && location) {
            // Get the generative model (gemini-pro) for text-only input
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Generate the specialty based on the symptom
            const symptomPrompt = `Suggest the speciality of the doctor from [${specialities.join(", ")}] based on the symptom: ${symptom}`;
            const result = await model.generateContent({ prompt: symptomPrompt });
            const response = await result.response;
            const text = response.text();

            // Verify the generated specialty is valid
            if (!specialities.includes(text)) {
                return res.status(400).json({ message: "The AI generated an invalid specialty. Please try again." });
            }

            // Fetch recommended doctors based on the generated specialty and location
            const recommendedDoctors = await recommendDoctors(text, location);
            const doctorNames = recommendedDoctors.map(doctor => doctor.Name);
            const responseText = `Recommended ${text}s in ${location}: ${doctorNames.join(', ')}`;
            return res.status(200).json({ message: responseText });
        } else {
            // If the request is not for doctor recommendation, use the prompt as-is
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Generate content based on the prompt
            const result = await model.generateContent({ prompt });

            // Get the response text from the result
            const text = result.candidates[0].output.trim();

            // Send the generated text as the response
            return res.status(200).json({ message: text });
        }
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    aiController
};
*/