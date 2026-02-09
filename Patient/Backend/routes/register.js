const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db'); // Adjust path if your db.js is in the root

router.post('/', async (req, res) => {
    const { fname, lname, date_of_birth, email, password, gender, phone_number, district, province } = req.body;

    try {
        const birthYear = new Date(date_of_birth).getFullYear();
        if (isNaN(birthYear) || birthYear < 1900) {
            return res.status(400).json({ message: "Invalid date of birth" });
        }

        const randomSuffix = Math.floor(10000 + Math.random() * 90000);
        const generatedMedId = `${birthYear}${randomSuffix}`;
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            'INSERT INTO patients (patient_id, fname, lname, date_of_birth, email, password, gender, phone_number, district, province) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING patient_id, email',
            [generatedMedId, fname, lname, date_of_birth, email, hashedPassword, gender, phone_number, district, province]
        );

        res.status(201).json({
            message: "User created successfully!",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error("DB Error:", err.message);
        if (err.code === '23505') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;