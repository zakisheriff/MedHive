const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const pool = require("../db");
const upload = require("../utils/upload");
const transporter = require("../utils/mailer");
const { containerClient } = require("../utils/blob");
const { registerSchema, loginSchema } = require("../utils/validation");

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
router.post("/register", upload.single("certificate"), async (req, res) => {
  try {
    const parsed = registerSchema.safeParse({
      clinicName: req.body.clinicName,
      registrationNo: req.body.registrationNo,
      email: req.body.email,
      password: req.body.password,
    });

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.issues,
      });
    }

    const { clinicName, registrationNo, email, password } = parsed.data;

    const existing = await pool.query(
      "SELECT clinic_id FROM clinics WHERE email = $1 OR license_number = $2 LIMIT 1",
      [email.toLowerCase(), registrationNo]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        error: "Clinic already exists with this email or license number.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let certificateUrl = null;

    if (req.file) {
      const safeBase = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanName = req.file.originalname.replace(/\s+/g, "_");
      const blobName = `certificates/${safeBase}-${cleanName}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: {
          blobContentType: req.file.mimetype,
        },
      });

      certificateUrl = blockBlobClient.url;
    }

    const result = await pool.query(
      `INSERT INTO clinics (
        clinic_name,
        license_number,
        email,
        password_hash,
        phsrc_certificate_image_url,
        verification_status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        clinic_id AS id,
        clinic_name,
        license_number,
        email,
        phsrc_certificate_image_url,
        verification_status,
        created_at`,
      [
        clinicName,
        registrationNo,
        email.toLowerCase(),
        passwordHash,
        certificateUrl,
        "PENDING",
      ]
    );

    const clinic = result.rows[0];

    await transporter.sendMail({
      from: `"MedHive Team" <${process.env.MEDHIVE_EMAIL}>`,
      to: clinic.email,
      subject: "Welcome to MedHive - Registration Pending",
      html: `
        <h2>Thank you for registering, ${clinic.clinic_name}!</h2>
        <p>We have received your application and PHSRC certificate.</p>
        <p>Our administrative team is currently verifying your details. You will receive an email once your account is approved.</p>
        <br />
        <p>Best regards,</p>
        <p>The MedHive Team</p>
      `,
    });

    const token = signToken({ clinicId: clinic.id, email: clinic.email });

    return res.status(201).json({
      message: "Registered successfully. Verification pending.",
      token,
      clinic,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.issues,
      });
    }

    const { email, password } = parsed.data;

    const result = await pool.query(
      `SELECT
        clinic_id AS id,
        clinic_name,
        license_number,
        email,
        password_hash,
        verification_status
       FROM clinics
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const clinic = result.rows[0];

    if (clinic.verification_status !== "APPROVED") {
      return res.status(403).json({ error: "Clinic not approved yet." });
    }

    const valid = await bcrypt.compare(password, clinic.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ clinicId: clinic.id, email: clinic.email });

    delete clinic.password_hash;

    return res.json({
      message: "Login successful",
      token,
      clinic,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;