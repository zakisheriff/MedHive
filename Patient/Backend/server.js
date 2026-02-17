require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
// Middleware
app.use(cors());
app.use(express.json());

// Add this Root Route for Azure Health Check
app.get('/', (req, res) => {
    res.send("MedHive Backend is Live!");
});

// Routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const googleSignUpRoute = require('./routes/google_signup');

// Point the paths to the specific files
app.use('/auth', registerRoute);
app.use('/auth', loginRoute);
app.use('/auth',googleSignUpRoute);

// Prescription Routes
const prescriptionRoute = require('./routes/prescription');
app.use('/api', prescriptionRoute);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});