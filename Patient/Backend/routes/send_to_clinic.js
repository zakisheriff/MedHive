const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

/**
 * @route POST /api/send-to-clinic
 * @desc Uploads a prescription to the clinic's incoming queue
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { patientName, medHiveId, clinicId, extractedData } = req.body;

        if (!patientName || !medHiveId || !clinicId) {
            return res.status(400).json({ error: 'Missing required tracking information' });
        }

        let parsedExtractedData = null;
        let medicines = '[]';
        let hasExtractedData = false;

        if (extractedData) {
            try {
                parsedExtractedData = JSON.parse(extractedData);
                medicines = JSON.stringify(parsedExtractedData.medicines || []);
                hasExtractedData = true;
            } catch (err) {
                console.warn("Failed to parse extractedData:", err);
            }
        }

        // Upload to Azure
        const imageUrl = await uploadToAzure(
            req.file.path,
            req.file.originalname,
            medHiveId || "anonymous"
        );

        // Delete local file after upload
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Insert into incoming_prescriptions
        const insertQuery = `
            INSERT INTO incoming_prescriptions (
                patient_name, 
                medhive_id, 
                prescription_image_url, 
                medicines, 
                has_extracted_data,
                clinic_id,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING id;
        `;

        const values = [
            patientName,
            medHiveId,
            imageUrl,
            medicines,
            hasExtractedData,
            clinicId
        ];

        const dbResult = await pool.query(insertQuery, values);

        res.json({ 
            message: 'Prescription sent successfully', 
            id: dbResult.rows[0].id 
        });

    } catch (error) {
        console.error("Error in /api/send-to-clinic:", error);
        
        // Clean up uploaded file if it failed before upload
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ error: 'Failed to send prescription' });
    }
});

module.exports = router;
