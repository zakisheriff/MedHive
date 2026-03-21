const express = require("express");
const router = express.Router();
const pool = require("../db");

// PUT request to update existing patient with medical history
router.put("/update-history/:medId", async (req, res) => {
  const { medId } = req.params;
  const { 
    medical_records, 
    diseases, 
    allergies, 
    other_info,
    blood_group,
    weight_kg,
    blood_pressure,
    emergency_contact_name,
    emergency_contact_phone
  } = req.body;

  try {
    const updatePatient = await pool.query(
      `UPDATE patients 
       SET medical_records = $1, 
           diseases = $2, 
           allergies = $3, 
           other_info = $4,
           blood_group = $5,
           weight_kg = $6,
           blood_pressure = $7,
           emergency_contact_name = $8,
           emergency_contact_phone = $9
       WHERE med_id = $10 
       RETURNING med_id, fname`,
      [medical_records, diseases, allergies, other_info, blood_group, weight_kg, blood_pressure, emergency_contact_name, emergency_contact_phone, medId]
    );

    if (updatePatient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Medical history updated successfully",
      patient: updatePatient.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;