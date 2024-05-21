const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const aiRoutes=require('./routes/apiRoutes');
const doctorRoutes=require('./routes/doctorRoutes');
const appointmentRoutes=require('./routes/appointmentRoutes');
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doctors',doctorRoutes);
app.use('/api/appointment',appointmentRoutes);


app.get('/', (req, res) => {
    res.send("<h1>Welcome to Health App</h1>");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
