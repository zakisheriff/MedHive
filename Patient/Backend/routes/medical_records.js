const express = require("express");
const router = express.Router();
const pool = require("../db");

// ADD RECORD
router.post("/:medId", async (req, res) => {
  const { medId } = req.params;
  const { title, image_url } = req.body;

  try {
    const newRecord = await pool.query(
      "INSERT INTO patient_medical_records (med_id, title, image_url) VALUES ($1, $2, $3) RETURNING *",
      [medId, title, image_url]
    );

    res.status(201).json({
      message: "Record added successfully",
      record: newRecord.rows[0],
    });
  } catch (err) {
    console.error("Add Record Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET RECORDS
router.get("/:medId", async (req, res) => {
  const { medId } = req.params;

  try {
    const records = await pool.query(
      "SELECT * FROM patient_medical_records WHERE med_id = $1 ORDER BY created_at DESC",
      [medId]
    );

    res.status(200).json({ records: records.rows });
  } catch (err) {
    console.error("Fetch Records Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET STATS
router.get("/stats/:medId", async (req, res) => {
  const { medId } = req.params;

  try {
    // Medical Records count
    const recordResult = await pool.query(
      "SELECT COUNT(*) FROM patient_medical_records WHERE med_id = $1",
      [medId]
    );
    const recordsCount = parseInt(recordResult.rows[0].count, 10);

    // Patients clinics/scans mocked actual columns
    const patientResult = await pool.query(
      "SELECT clinics_count, scans_count FROM patients WHERE med_id = $1",
      [medId]
    );

    let clinicsCount = 0;
    let scansCount = 0;

    if (patientResult.rows.length > 0) {
      clinicsCount = patientResult.rows[0].clinics_count || 0;
      scansCount = patientResult.rows[0].scans_count || 0;
    }

    res.status(200).json({
      records: recordsCount,
      clinics: clinicsCount,
      scans: scansCount
    });

  } catch (err) {
    console.error("Fetch Stats Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE RECORD
router.delete("/record/:recordId", async (req, res) => {
  const { recordId } = req.params;

  try {
    await pool.query(
      "DELETE FROM patient_medical_records WHERE id = $1",
      [recordId]
    );
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete Record Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE RECORD TITLE
router.put("/record/:recordId", async (req, res) => {
  const { recordId } = req.params;
  const { title } = req.body;

  try {
    const updatedRecord = await pool.query(
      "UPDATE patient_medical_records SET title = $1 WHERE id = $2 RETURNING *",
      [title, recordId]
    );

    if (updatedRecord.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record updated successfully", record: updatedRecord.rows[0] });
  } catch (err) {
    console.error("Update Record Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
