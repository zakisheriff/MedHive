const express = require("express");
const pool = require("../db");
const authRequired = require("../middleware/authRequired");
const router = express.Router();

/**
 * @route GET /api/patients/search
 * @desc Search for patients by Med-ID or Name
 */
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Search query is required" });

  try {
    const result = await pool.query(
      `SELECT med_id, fname, lname, gender, date_of_birth 
       FROM patients 
       WHERE med_id::text ILIKE $1 OR fname ILIKE $1 OR lname ILIKE $1
       ORDER BY fname ASC
       LIMIT 10`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

/**
 * @route POST /api/patients/request-access
 * @desc Generate a 2-digit OTP for a patient
 */
router.post("/request-access", async (req, res) => {
  const { med_id } = req.body;
  if (!med_id) return res.status(400).json({ error: "Med ID is required" });

  try {
    // Generate 2-digit OTP (10-99)
    const otp = Math.floor(10 + Math.random() * 90).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    await pool.query(
      `INSERT INTO patient_access_codes (med_id, otp, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (med_id) 
       DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
      [med_id, otp, expiresAt]
    );

    // In a real scenario, this would trigger a notification to the patient's app.
    // For now, the patient app will poll or fetch this code.
    res.json({ message: "Access requested. OTP generated successfully." });
  } catch (err) {
    console.error("Request access error:", err.message);
    res.status(500).json({ error: "Failed to request access" });
  }
});

/**
 * @route POST /api/patients/verify-otp
 * @desc Verify OTP, reveal patient details, and log the visit
 */
// NOTE: Added authRequired middleware here so we know which doctor is making the request
router.post("/verify-otp", authRequired, async (req, res) => {
  const { med_id, otp } = req.body;
  if (!med_id || !otp) return res.status(400).json({ error: "Med ID and OTP are required" });

  try {
    const result = await pool.query(
      `SELECT id FROM patient_access_codes 
       WHERE med_id = $1 AND otp = $2 AND expires_at > NOW()`,
      [med_id, otp]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // OTP verified, fetch full profile
    const patientResult = await pool.query(
      `SELECT med_id, fname, lname, gender, date_of_birth, phone_number, district, province, email 
       FROM patients WHERE med_id = $1`,
      [med_id]
    );

    // Also fetch their prescriptions
    const prescriptionsResult = await pool.query(
      `SELECT prescription_id, status, prescription_image_url, created_at, raw_ai_output
       FROM prescriptions 
       WHERE med_id = $1 
       ORDER BY created_at DESC`,
      [med_id]
    );

    // Clear the OTP after successful verification to prevent reuse
    await pool.query("DELETE FROM patient_access_codes WHERE med_id = $1", [med_id]);

    // NEW LOGIC: Track the patient visit if a doctor is logged in
    if (req.user && req.user.doctorId) {
      await pool.query(
        `INSERT INTO visited_patients (doctor_id, patient_id) VALUES ($1, $2)`,
        [req.user.doctorId, med_id]
      );
    }

    res.json({
      patient: patientResult.rows[0],
      prescriptions: prescriptionsResult.rows
    });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;