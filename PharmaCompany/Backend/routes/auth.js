import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import upload from "../utils/upload.js";
import transporter from "../utils/mailer.js"; // For future welcome emails
import { containerClient } from "../utils/blob.js";

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", upload.single("certificate"), async (req, res) => {
  try {
    // 1. Destructure using the EXACT names from your React frontend's formData
    const { 
      companyName, 
      email, 
      registrationNumber, 
      password, 
      nmraLicenseNumber, 
      licenseExpiryDate 
    } = req.body;

    // Validation: Ensure the file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "NMRA Certificate image is required" });
    }

    // 2. Azure Blob Storage Upload Logic
    const safeFileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const blobPath = `certificates/pharma/${nmraLicenseNumber}/${safeFileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const certificateUrl = blockBlobClient.url;

    // 3. Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. SQL Query - Matches the simplified schema (No address/postal code)
    const query = `
      INSERT INTO pharma_companies (
        company_name, 
        contact_email, 
        company_reg_no, 
        password_hash, 
        nmra_license_no, 
        license_expiry_date, 
        license_certificate_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING pharma_id
    `;
    
    const result = await pool.query(query, [
      companyName, 
      email.toLowerCase(), 
      registrationNumber, // This maps to company_reg_no
      hashedPassword, 
      nmraLicenseNumber, 
      licenseExpiryDate, 
      certificateUrl
    ]);

    res.status(201).json({ 
      message: "Registration successful. Pending admin approval.", 
      pharmaId: result.rows[0].pharma_id 
    });

  } catch (err) {
    console.error("Registration Error:", err);
    // Handle unique constraint violations (e.g., email already exists)
    if (err.code === '23505') {
      return res.status(400).json({ error: "Email or License Number already registered" });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const result = await pool.query(
      "SELECT * FROM pharma_companies WHERE contact_email = $1", 
      [email.toLowerCase()]
    );
    
    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const user = result.rows[0];

    // 2. Check Verification Status (Block if not approved)
    if (user.verification_status !== "APPROVED") {
      return res.status(403).json({ error: "Verification pending. Please wait for admin approval." });
    }

    // 3. Compare hashed password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Generate JWT
    const token = signToken({ id: user.pharma_id, email: user.contact_email });

    // 5. Send response (Don't send the password_hash back!)
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ 
      token, 
      user: userWithoutPassword 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;