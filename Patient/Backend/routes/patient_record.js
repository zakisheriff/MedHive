const express = require("express");
const router = express.Router();
const pool = require("../db");

const extractMedicines = (text) => {
  if (!text) return [];

  return text
    .split("\n")
    .filter(line => line.trim() !== "")
    .slice(0, 2)
    .map(name => ({
      name,
      dosage: "",
      frequency: "",
      duration: ""
    }));
};

router.get("/:med_id", async (req, res) => {
  const { med_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM prescriptions 
       WHERE med_id = $1 
       ORDER BY created_at DESC`,
      [med_id]
    );

    const formatted = result.rows.map(item => ({
      id: item.prescription_id.toString(),
      type: "prescription",
      title: "Digital Prescription",
      date: item.created_at,
      clinicName: item.clinic_id || "Clinic",
      medicines: extractMedicines(item.raw_ai_output),
      status: "completed",
      notes: item.diagnosis || "",
      imageUri: item.prescription_image_url
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;