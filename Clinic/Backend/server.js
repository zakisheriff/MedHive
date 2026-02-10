// server.js
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASSWORD
  }
});

const pool = require("./db");

const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));    //allows frontend to talk to backend
app.use(express.json());
app.use(morgan("dev"));

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));     //making uploads folder publicly accessible to view certificate images in browser

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config for certificate upload
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safeBase = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${safeBase}${ext}`);
  },
});

const upload = multer({
  storage,
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

// Validation schemas (match your register page)
const registerSchema = z.object({
  clinicName: z.string().min(2).max(150),
  registrationNo: z.string().min(2).max(100), // will be saved into license_number
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72),
});

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Health check
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// REGISTER
app.post("/api/auth/register", upload.single("certificate"), async (req, res) => {
  try {
    const parsed = registerSchema.safeParse({
      clinicName: req.body.clinicName,
      registrationNo: req.body.registrationNo,
      email: req.body.email,
      password: req.body.password,
    });

    if (!parsed.success) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ error: "Invalid input", details: parsed.error.issues });
    }

    const { clinicName, registrationNo, email, password } = parsed.data;

    // Check existing using real columns
    const existing = await pool.query(
      "SELECT clinic_id FROM clinics WHERE email = $1 OR license_number = $2 LIMIT 1",
      [email.toLowerCase(), registrationNo]
    );

    if (existing.rowCount > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        error: "Clinic already exists with this email or license number.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Store uploaded certificate image path into phsrc_certificate_image_url
    const certificateUrl = req.file
      ? `/uploads/${path.basename(req.file.path)}`
      : null;

    const inserted = await pool.query(
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

    const clinic = inserted.rows[0];
    await transporter.sendMail({
      from: `"MedHive Team" <${process.env.MEDHIVE_EMAIL}>`,
      to: email.toLowerCase(), // Sending TO the user who just registered
      subject: "Welcome to MedHive - Registration Pending",
      html: `
        <h2>Thank you for registering, ${clinicName}!</h2>
        <p>We have received your application and PHSRC certificate.</p>
        <p>Our administrative team is currently verifying your details. You will receive an email once your account is activated.</p>
        <br />
        <p>Best Regards,</p>
        <p>The MedHive Team</p>
      `,
    });

    const token = signToken({ clinicId: clinic.id, email: clinic.email });

    return res.status(201).json({
      message: "Registered successfully. Verification pending...",
      token,
      clinic,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH to approve a specific clinic
app.patch("/api/admin/approve-clinic/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE clinics SET verification_status = 'APPROVED' WHERE clinic_id = $1 RETURNING clinic_name, email",
      [id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Clinic not found" });

    const clinic = result.rows[0];

    // OPTIONAL: Send a "You've been approved" email back to the clinic
    await transporter.sendMail({
      from: `"MedHive Team" <${process.env.MEDHIVE_EMAIL}>`,
      to: clinic.email,
      subject: "MedHive Account Approved!",
      text: `Congratulations ${clinic.clinic_name}! Your MedHive account has been approved. You can now log in to the dashboard.`
    });

    res.json({ message: `Clinic ${clinic.clinic_name} approved successfully.` });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Approval failed" });
  }
});

app.get("/api/admin/pending-clinics", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT clinic_id, clinic_name, email, license_number, phsrc_certificate_image_url FROM clinics WHERE verification_status = 'PENDING' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching pending clinics:", err);
    res.status(500).json({ error: "Failed to fetch pending clinics" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parsed.error.issues });
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

    // only allow login if approved (your DB shows APPROVED)
    if (clinic.verification_status !== "APPROVED") {
      return res.status(403).json({ error: "Clinic not approved yet." });
    }

    const ok = await bcrypt.compare(password, clinic.password_hash);
    if (!ok) {
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
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// JWT middleware
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// /api/me
app.get("/api/me", authRequired, async (req, res) => {
  const { clinicId } = req.user;

  const r = await pool.query(
    `SELECT clinic_id AS id, clinic_name, verification_status FROM clinics WHERE clinic_id = $1`,
    [clinicId]
  );

  if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
  
  // Note: We return the status here regardless of whether it's APPROVED or PENDING
  res.json({ clinic: r.rows[0] });
});

// Start
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));

//working