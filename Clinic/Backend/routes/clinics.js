const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/clinics/verified
router.get("/verified", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT clinic_id, clinic_name, district, province
       FROM clinics
       WHERE verification_status = 'APPROVED'
       ORDER BY clinic_name ASC`
    );

    return res.json({ clinics: result.rows });
  } catch (error) {
    console.error("Error fetching verified clinics:", error);
    return res.status(500).json({ error: "Failed to fetch clinics" });
  }
});

module.exports = router;