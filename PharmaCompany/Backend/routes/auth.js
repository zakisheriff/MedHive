const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const upload = require("../utils/upload");
const transporter = require("../utils/mailer");
const { containerClient } = require("../utils/blob");
const { registerSchema, loginSchema } = require("../utils/validation");

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", upload.single("certificate"), async (req, res) => {
  try {
    const { companyName, registrationNumber, email, password } = req.body;

    // 1. Check if exists
    const existing = await pool.query("SELECT pharma_id FROM pharma_companies WHERE contact_email = $1", [email.toLowerCase()]);
    if (existing.rowCount > 0) return res.status(409).json({ error: "Email already registered" });

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Upload to Azure
    let certificateUrl = null;
    if (req.file) {
      const blobName = `pharma/${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype }
      });
      certificateUrl = blockBlobClient.url;
    }

    // 4. Insert with PENDING status
    const result = await pool.query(
      `INSERT INTO pharma_companies (company_name, company_reg_no, contact_email, password_hash, license_certificate_url, verification_status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING') RETURNING *`,
      [companyName, registrationNumber, email.toLowerCase(), passwordHash, certificateUrl]
    );

    // 5. Send Confirmation Email
    await transporter.sendMail({
      from: `"MedHive" <${process.env.MEDHIVE_EMAIL}>`,
      to: email,
      subject: "Registration Received - MedHive Pharma",
      html: `<h2>Welcome ${companyName}!</h2><p>Our team is verifying your license. You will be notified once approved.</p>`
    });

    res.status(201).json({ message: "Success", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM pharma_companies WHERE contact_email = $1", [email.toLowerCase()]);
  
  if (result.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
  
  const user = result.rows[0];

  // Logic: Block login if not approved
  if (user.verification_status !== "APPROVED") {
    return res.status(403).json({ error: "Verification pending. Please wait for admin approval." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.pharma_id, email: user.contact_email });
  res.json({ token, user });
});

module.exports = router;