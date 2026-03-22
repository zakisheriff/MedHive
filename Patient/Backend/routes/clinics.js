const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route GET /api/clinics
 * @desc Get all verified clinics
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT clinic_id, clinic_name, district, province 
             FROM clinics 
             WHERE verification_status = 'APPROVED'
             ORDER BY clinic_name ASC`
        );
        
        res.json({ clinics: result.rows });
    } catch (err) {
        console.error('Error fetching clinics:', err.message);
        res.status(500).json({ error: 'Server error while fetching clinics' });
    }
});

module.exports = router;
