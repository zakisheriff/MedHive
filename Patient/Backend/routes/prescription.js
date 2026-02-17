const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FormData = require('form-data');
const axios = require('axios');

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Initialize Gemini
// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Extract Prescription Data
// Route: /api/extract (mounted as /extract in this router)
router.post('/extract', upload.single('image'), async (req, res) => {
    console.log('--- New Extraction Request Received ---');
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert image to base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = imageBuffer.toString('base64');

        const prompt = `
        You are an expert pharmacist and medical data extractor. Your job is to extract medicine details from the provided prescription image and correct any spelling errors (e.g., "Amoxirillin" -> "Amoxicillin").
        
        STRICT VALIDATION RULE:
        First, determine if the image is a valid medical document (Prescription or Lab Report).
        If the image is NOT a medical document (e.g., flowers, landscapes, animals, random objects, food, etc.), you MUST set "is_medical": false and leave "medicines" and "labTests" as empty arrays.
        
        Strictly follow these rules for extraction:
        1. Identify all medicines, dosages, frequencies, and durations.
        2. Identify all lab tests if it is a lab report.
        3. If a medicine/test name is misspelled, output the CORRECTED name.
        4. Omit any preambles, disclaimers, or markdown code blocks. Just return the raw JSON.
        5. For the summary, provide a direct professional explanation.
        6. Set "is_medical" to true only if it is a legitimate medical document.

        Output Format (JSON):
        {
          "is_medical": boolean,
          "medicines": [
            {
              "name": "Corrected Name",
              "dosage": "500mg",
              "frequency": "3x a day",
              "duration": "7 days",
              "instructions": "Take after food"
            }
          ],
          "labTests": [
             {"name": "CBC", "result": "Normal"}
          ],
          "summary": "Professional summary here..."
        }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: req.file.mimetype
                }
            }
        ]);

        const response = await result.response;
        let text = response.text();

        // Robust JSON cleanup: find the first '{' and last '}'
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            text = text.substring(jsonStart, jsonEnd + 1);
        }

        let extractedData;
        try {
            extractedData = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.error("Raw Text:", text);
            return res.status(500).json({ error: "Failed to parse AI response" });
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json(extractedData);
    } catch (error) {
        console.log('Error extracting data:', error.message || error);
        // Clean up file if it exists and error occurred
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(error.status || 500).json({
            error: error.message || 'Failed to process image',
            details: error.errorDetails || []
        });
    }
});

// 2. Get Medicine Summary
// Route: /api/summary
router.post('/summary', async (req, res) => {
    try {
        const { medicineName } = req.body;
        if (!medicineName) {
            return res.status(400).json({ error: 'Medicine name is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Provide a professional, concise summary for the medicine: ${medicineName}. Include what it is used for, common side effects, and important precautions.Format it with clear headings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.json({ summary });
    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).json({ error: 'Failed to get summary' });
    }
});

// 3. Save to History
// Route: /api/history
router.post('/history', async (req, res) => {
    try {
        const data = req.body;
        // In a real app, save to DB. For now, we'll just mock it.
        // You can add DB logic here later using pool from ../db
        console.log('Saving to history:', data);
        res.json({ success: true, message: 'Saved to history' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save to history' });
    }
});

// 4. Send Prescription to Clinic
// Route: /api/send-to-clinic
router.post('/send-to-clinic', upload.single('image'), async (req, res) => {
    try {
        console.log('--- Send to Clinic Request Received ---');

        if (!req.file) {
            return res.status(400).json({ error: 'No prescription image provided' });
        }

        // Parse the extracted data and patient info from request body
        const { extractedData, patientName, medHiveId } = req.body;

        // Parse extractedData if it's a string
        let parsedExtractedData = null;
        let hasExtractedData = false;

        if (extractedData) {
            try {
                parsedExtractedData = typeof extractedData === 'string'
                    ? JSON.parse(extractedData)
                    : extractedData;
                hasExtractedData = parsedExtractedData && parsedExtractedData.medicines && parsedExtractedData.medicines.length > 0;
            } catch (e) {
                console.log('Failed to parse extracted data, sending image only');
            }
        }

        // Prepare form data to send to Clinic Backend
        const formData = new FormData();

        // Read the file from disk and add it to FormData
        const fileStream = fs.createReadStream(req.file.path);
        formData.append('image', fileStream, {
            filename: req.file.originalname || 'prescription.jpg',
            contentType: req.file.mimetype
        });

        // Add patient info and extracted data
        formData.append('patientName', patientName || 'Unknown Patient');
        formData.append('medHiveId', medHiveId || 'N/A');
        formData.append('hasExtractedData', hasExtractedData.toString());

        if (hasExtractedData) {
            formData.append('medicines', JSON.stringify(parsedExtractedData.medicines));
        }

        // Forward to Clinic Backend
        const CLINIC_BACKEND_URL = process.env.CLINIC_BACKEND_URL || 'http://localhost:5002';

        const response = await axios.post(
            `${CLINIC_BACKEND_URL}/api/prescriptions/incoming`,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        res.json({
            success: true,
            message: 'Prescription sent to clinic successfully',
            prescriptionId: response.data.prescriptionId
        });

    } catch (error) {
        console.error('Error sending to clinic:', error);
        res.status(500).json({ error: 'Failed to send prescription to clinic' });
    }
});

module.exports = router;

