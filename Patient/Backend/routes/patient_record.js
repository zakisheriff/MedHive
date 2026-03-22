const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET HISTORY FOR A USER
router.get("/:med_id", async (req, res) => {
  const { med_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        prescription_id,
        clinic_id,
        diagnosis,
        raw_ai_output,
        confidence_score,
        created_at,
        prescription_image_url
       FROM prescriptions
       WHERE med_id = $1
       ORDER BY created_at DESC`,
      [med_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;