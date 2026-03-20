const express = require("express");
const pool = require("../db");
const authRequired = require("../middleware/authRequired");

const router = express.Router();

/**
 * @route GET /api/me
 * @desc Get currently logged in clinic profile
 */
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
      return res.status(404).json({ error: "Clinic not found" });
    }

    res.json({ clinic: result.rows[0] });
  } catch (err) {
    console.error("/api/me error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;