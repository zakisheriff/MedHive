const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FormData = require('form-data');
const axios = require('axios');
const { uploadToAzure } = require('../utils/azureBlob');
const pool = require("../db");

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
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Extract Prescription Data
router.post('/extract', upload.single('image'), async (req, res) => {
    console.log('--- New Extraction Request Received ---');
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        
        const { patientId, district, province } = req.body;

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

        const imageUrl = await uploadToAzure(
            req.file.path,
            req.file.originalname,
            patientId || "anonymous"
        );

        const insertQuery = `
            INSERT INTO prescriptions (
                med_id, 
                clinic_id, 
                raw_ai_output, 
                status, 
                prescription_image_url, 
                patient_district, 
                patient_province
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING prescription_id;
        `;

        const values = [
            patientId || "anonymous",
            null,
            JSON.stringify(extractedData),
            'EXTRACTED',
            imageUrl,
            district || null,
            province || null
        ];

        const dbResult = await pool.query(insertQuery, values);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            ...extractedData,
            imageUrl,
            prescriptionId: dbResult.rows[0].prescription_id
        });

    } catch (error) {
        console.log('Error extracting data:', error.message || error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(error.status || 500).json({
            error: error.message || 'Failed to process image',
            details: error.errorDetails || []
        });
    }
});
module.exports = router;