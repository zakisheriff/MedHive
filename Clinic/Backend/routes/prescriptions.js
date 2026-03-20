const express = require("express");
const pool = require("../db");
const authRequired = require("../middleware/authRequired");

const router = express.Router();

// GET /api/me
router.get("/me", authRequired, async (req, res) => {
  try {
    const { clinicId } = req.user;

    const result = await pool.query(
      `SELECT
        clinic_id AS id,
        clinic_name,
        license_number,
        email,
        phsrc_certificate_image_url,
        verification_status,
        created_at
       FROM clinics
       WHERE clinic_id = $1`,
      [clinicId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ clinic: result.rows[0] });
  } catch (err) {
    console.error("/api/me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /api/prescriptions/incoming
 * @desc Fetch all pending prescriptions for the clinic dashboard
 */
router.get("/incoming", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incoming_prescriptions WHERE status = 'pending' ORDER BY received_at DESC"
    );
    res.json({ prescriptions: result.rows });
  } catch (err) {
    console.error("Error fetching incoming prescriptions:", err.message);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

/**
 * @route PATCH /api/prescriptions/:id/dispense
 * @desc Mark a prescription as dispensed
 */
router.patch("/:id/dispense", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE incoming_prescriptions SET status = 'dispensed' WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.json({ message: "Prescription dispensed successfully", prescription: result.rows[0] });
  } catch (err) {
    console.error("Dispense error:", err.message);
    res.status(500).json({ error: "Failed to dispense prescription" });
  }
});

module.exports = router;