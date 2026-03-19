const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/google-complete-profile', async (req, res) => {
  const {
    fname,
    lname,
    email,
    date_of_birth,
    gender,
    phone_number,
    district,
    province,
  } = req.body;

  try {
    const birthYear = new Date(date_of_birth).getFullYear();
    if (isNaN(birthYear) || birthYear < 1900) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedMedId = `${birthYear}${randomSuffix}`;

    // Generate a random password for Google-authenticated users
    // If they want to login via email later, they can use 'Forgot Password'
    const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO patients (med_id, fname, lname, date_of_birth, gender, phone_number, district, province, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        generatedMedId,
        fname,
        lname,
        date_of_birth,
        gender,
        phone_number,
        district,
        province,
        email,
        hashedPassword
      ]
    );

    const { password: _, ...patientInfo } = newUser.rows[0];
    res.status(201).json({
      message: "Profile completed successfully!",
      user: patientInfo,
    });
  } catch (err) {
    console.error("DB Error:", err.message);
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
