const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/login', async (req, res) => {
    console.log(`Login attempt received for: ${req.body.email}`);
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const { password: _, ...patientInfo } = user.rows[0];
        res.status(200).json({
            message: "Login successful!",
            user: patientInfo
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;