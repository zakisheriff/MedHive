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

module.exports = router;