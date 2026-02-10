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
            Analyze this medical image carefully. 
            
            ROLE: You are an expert pharmacist and medical data extractor. Your job is to extract prescription details with 100% accuracy, correcting minor OCR errors in medicine names based on known drug names (e.g., "Amoxirillin" -> "Amoxicillin").

            TASK:
            1. Identify if the image is a prescription or lab report.
            2. If NOT medical, return {"error": "not_medical_record"}.
            3. If medical, extract the data into the JSON format below.

            EXTRACTION RULES:
            - Medicine Name: Extract the full generic or brand name. CORRRECT SPELLING ERRORS.
            - Dosage: Extract strength (e.g., 500mg, 10ml). If mixed with name, separate it.
            - Frequency: Extract how often to take (e.g., "3x a day", "BID", "every 8 hours").
            - Duration: Extract how long to take (e.g., "7 days", "1 week").
            - Instructions: Any special notes (e.g., "after food").

            OUTPUT JSON FORMAT:
            {
                "type": "prescription" | "lab_report",
                "medicines": [
                    {
                        "name": "string (Corrected Medicine Name)",
                        "dosage": "string (e.g. 500mg)",
                        "frequency": "string (e.g. 3 times daily)",
                        "duration": "string (e.g. 7 days)",
                        "instructions": "string"
                    }
                ],
                "patient_name": "string or null",
                "date": "string or null"
            }
            
            Return ONLY the raw JSON. No markdown formatting.
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
        text = text.replace(/```json| ```/g, '').trim();

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

module.exports = router;
