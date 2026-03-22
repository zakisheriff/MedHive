require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add this Root Route for Azure Health Check
app.get('/', (req, res) => {
    res.send("MedHive Backend is Live!");
});

// Routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const googleSignUpRoute = require('./routes/google_signup');
const googleCompleteProfileRoute = require('./routes/google_complete_profile');

// Point the paths to the specific files
app.use('/auth', registerRoute);
app.use('/auth', loginRoute);
app.use('/auth', googleSignUpRoute);
app.use('/auth', googleCompleteProfileRoute);

// Prescription Routes
const prescriptionRoute = require('./routes/prescription');
const accessRoute = require('./routes/access');

app.use('/api', prescriptionRoute);
app.use('/api/access', accessRoute);

const medicalHistoryRoute = require('./routes/medical_history');
app.use('/api', medicalHistoryRoute);

const medicalRecordsRoute = require('./routes/medical_records');
app.use('/api/medical-records', medicalRecordsRoute);


const patientRecordRoutes = require("./routes/patient_record");
app.use("/api/patient_record", patientRecordRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});