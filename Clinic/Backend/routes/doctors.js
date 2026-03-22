const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authRequired = require("../middleware/authRequired");

const router = express.Router();

// POST /api/doctors/register
// Registers a doctor under the currently logged-in clinic
router.post("/register", authRequired, async (req, res) => {
  try {
    const { name, nic, password } = req.body;
    const clinicId = req.user.clinicId; 

    if (!name || !nic || !password) {
      return res.status(400).json({ error: "Name, NIC, and password are required" });
    }

    // Check if doctor NIC already exists
    const existing = await pool.query("SELECT id FROM doctors WHERE nic = $1", [nic]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "A doctor with this NIC already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO doctors (clinic_id, name, nic, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, clinic_id, name, nic, created_at`,
      [clinicId, name, nic, passwordHash]
    );

    res.status(201).json({ 
      message: "Doctor registered successfully", 
      doctor: result.rows[0] 
    });
  } catch (err) {
    console.error("Doctor registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/doctors/login
// Doctor login to get a doctor-specific token
router.post("/login", async (req, res) => {
  try {
    const { nic, password } = req.body;

    const result = await pool.query("SELECT * FROM doctors WHERE nic = $1", [nic]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid NIC or password" });
    }

    const doctor = result.rows[0];
    const valid = await bcrypt.compare(password, doctor.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid NIC or password" });
    }

    // Sign token with doctorId so we can track them in subsequent requests
    const token = jwt.sign(
      { doctorId: doctor.id, clinicId: doctor.clinic_id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    delete doctor.password_hash;

    res.json({ message: "Login successful", token, doctor });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/doctors/history
// Fetch patient visit history for the logged-in doctor
router.get("/history", authRequired, async (req, res) => {
  try {
    const { doctorId } = req.user;

    if (!doctorId) {
      return res.status(403).json({ error: "Only logged-in doctors can view this history" });
    }

    const result = await pool.query(
      `SELECT vp.id AS visit_id, vp.visited_at, p.med_id, p.fname, p.lname, p.gender 
       FROM visited_patients vp
       JOIN patients p ON vp.patient_id = p.med_id::text
       WHERE vp.doctor_id = $1
       ORDER BY vp.visited_at DESC`,
      [doctorId]
    );

    res.json({ history: result.rows });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;