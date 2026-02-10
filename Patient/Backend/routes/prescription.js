const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
            Analyze this image. 
            FIRST: Determine if this is a medical prescription or a lab report.
            If it is NOT a prescription and NOT a lab report (e.g., if it's a flower, a person, a landscape, etc.), 
            return EXACTLY this JSON and nothing else: {"error": "not_medical_record"}.

            If it IS a medical record, extract the following information in JSON format:
            {
                "type": "prescription" | "lab_report",
                "medicines": [
                    {
                        "name": "string",
                        "dosage": "string",
                        "frequency": "string",
                        "duration": "string",
                        "instructions": "string"
                    }
                ],
                "patient_name": "string",
                "date": "string"
            }
            If it's a lab report, extract key findings in the medicines array with name as the test name and dosage as the result.
            Return ONLY the raw JSON.
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

        // Clean up JSON response if Gemini adds markdown blocks
        text = text.replace(/```json|```/g, '').trim();

        let extractedData;
        try {
            extractedData = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback if JSON is malformed, though usually prompt engineering handles this
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
        const prompt = `Provide a professional, concise summary for the medicine: ${medicineName}. Include what it is used for, common side effects, and important precautions. Format it with clear headings.`;

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

module.exports = router;
