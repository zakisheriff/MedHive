const express = require("express");
const pool = require("../db");
const transporter = require("../utils/mailer");

const router = express.Router();

// GET /api/admin/pending-clinics
router.get("/pending-clinics", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        clinic_id,
        clinic_name,
        email,
        license_number,
        phsrc_certificate_image_url,
        created_at
       FROM clinics
       WHERE verification_status = 'PENDING'
       ORDER BY created_at DESC`
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Error fetching pending clinics:", err);
    return res.status(500).json({ error: "Failed to fetch pending clinics" });
  }
});

// PATCH /api/admin/approve-clinic/:id
router.patch("/approve-clinic/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE clinics
       SET verification_status = 'APPROVED'
       WHERE clinic_id = $1
       RETURNING clinic_name, email`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    const clinic = result.rows[0];

    await transporter.sendMail({
      from: `"MedHive Team" <${process.env.MEDHIVE_EMAIL}>`,
      to: clinic.email,
      subject: "MedHive Account Approved!",
      text: `Congratulations ${clinic.clinic_name}! Your MedHive account has been approved. You can now log in to the dashboard.`,
    });

    return res.json({
      message: `Clinic ${clinic.clinic_name} approved successfully.`,
    });
  } catch (err) {
    console.error("Approval error:", err);
    return res.status(500).json({ error: "Approval failed" });
  }
});

module.exports = router;