require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { z } = require("zod");
const nodemailer = require("nodemailer");
const { BlobServiceClient } = require("@azure/storage-blob");

const pool = require("./db");

const app = express();

// ================= MIDDLEWARE =================
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// ================= AZURE =================
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASSWORD,
  },
});

// ================= MULTER =================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF or image files are allowed."));
    }
    cb(null, true);
  },
});

// ================= VALIDATION =================
const registerSchema = z.object({
  clinicName: z.string().min(2),
  registrationNo: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ================= HELPERS =================
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ================= HEALTH =================
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// ================= REGISTER =================
app.post("/api/auth/register", upload.single("certificate"), async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.issues,
      });
    }

    const { clinicName, registrationNo, email, password } = parsed.data;

    const existing = await pool.query(
      "SELECT clinic_id FROM clinics WHERE email = $1 OR license_number = $2",
      [email.toLowerCase(), registrationNo]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        error: "Clinic already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let certificateUrl = null;

    if (req.file) {
      const blobName = `cert-${Date.now()}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
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
      RETURNING clinic_id AS id, clinic_name, email, verification_status`,
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

    // send email
    await transporter.sendMail({
      from: `"MedHive" <${process.env.MEDHIVE_EMAIL}>`,
      to: clinic.email,
      subject: "Registration Pending",
      text: "Your clinic is under review.",
    });

    const token = signToken({ clinicId: clinic.id });

    res.status(201).json({
      message: "Registered successfully",
      token,
      clinic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = parsed.data;

    const result = await pool.query(
      `SELECT clinic_id AS id, email, password_hash, verification_status
       FROM clinics WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const clinic = result.rows[0];

    if (clinic.verification_status !== "APPROVED") {
      return res.status(403).json({ error: "Not approved yet" });
    }

    const valid = await bcrypt.compare(password, clinic.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ clinicId: clinic.id });

    delete clinic.password_hash;

    res.json({
      message: "Login successful",
      token,
      clinic,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= PRESCRIPTIONS =================

// Receive prescription
app.post("/api/prescriptions/incoming", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const blobName = `prescription-${Date.now()}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer);

    const result = await pool.query(
      `INSERT INTO incoming_prescriptions (prescription_image_url, status)
       VALUES ($1, $2) RETURNING id`,
      [blockBlobClient.url, "pending"]
    );

    res.json({ id: result.rows[0].id });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get prescriptions
app.get("/api/prescriptions/incoming", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM incoming_prescriptions WHERE status = 'pending'"
  );
  res.json(result.rows);
});

// ================= START =================
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});