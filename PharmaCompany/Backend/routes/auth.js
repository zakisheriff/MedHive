import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // Ensure you add .js extensions for local files
import upload from "../utils/upload.js";
import transporter from "../utils/mailer.js";
import { containerClient } from "../utils/blob.js";
import { registerSchema, loginSchema } from "../utils/validation.js";

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", upload.single("certificate"), async (req, res) => {
  try {
    const { nmraLicenseNumber, companyName, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Certificate image is required" });
    }

    const safeFileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const blobPath = `certificates/pharma/${nmraLicenseNumber}/${safeFileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { 
        blobContentType: req.file.mimetype 
      },
    });

    const certificateUrl = blockBlobClient.url;

    const query = `
      INSERT INTO pharma_companies (
        company_name, 
        nmra_license_no, 
        license_certificate_url, 
        verification_status
      )
      VALUES ($1, $2, $3, 'PENDING')
      RETURNING pharma_id
    `;
    
    const result = await pool.query(query, [companyName, nmraLicenseNumber, certificateUrl]);

    res.status(201).json({ 
      message: "Registration successful", 
      pharmaId: result.rows[0].pharma_id 
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error during file upload" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM pharma_companies WHERE contact_email = $1", [email.toLowerCase()]);
  
  if (result.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
  
  const user = result.rows[0];

  if (user.verification_status !== "APPROVED") {
    return res.status(403).json({ error: "Verification pending. Please wait for admin approval." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.pharma_id, email: user.contact_email });
  res.json({ token, user });
});

// THIS IS THE KEY CHANGE:
export default router;