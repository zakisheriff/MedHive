const express = require("express");
const pool = require("../db");
const router = express.Router();

/**
 * @route GET /api/access/active-otp/:med_id
 * @desc Fetch the current active OTP for a patient
 */
router.get("/active-otp/:med_id", async (req, res) => {
  const { med_id } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT otp FROM patient_access_codes WHERE med_id = $1 AND expires_at > NOW()",
      [med_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No active access request found." });
    }

    res.json({ otp: result.rows[0].otp });
  } catch (err) {
    console.error("Fetch OTP error:", err.message);
    res.status(500).json({ error: "Failed to fetch access code." });
  }
});

module.exports = router;
