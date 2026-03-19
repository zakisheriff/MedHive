// Server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { z } = require("zod");
const nodemailer = require("nodemailer");
const { BlobServiceClient } = require("@azure/storage-blob");

const pool = require("./db");

const app = express();

//  MIDDLEWARE 
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

//  AZURE 
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

//  EMAIL 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASSWORD,
  },
});

//  MULTER 
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

//  VALIDATION 
const registerSchema = z.object({
  clinicName: z.string().min(2).max(150),
  registrationNo: z.string().min(2).max(100),
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

//  HELPERS 
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

//  HEALTH 
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

//  AUTH 

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
      const blobName = `certificates/${safeBase}-${req.file.originalname.replace(/\s+/g, "_")}`;
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

// LOGIN
app.post("/api/auth/login", async (req, res) => {
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

// GET CURRENT CLINIC
app.get("/api/me", authRequired, async (req, res) => {
  try {
    const { clinicId } = req.user;

    const result = await pool.query(
      `SELECT
        clinic_id AS id,
        clinic_name,
        license_number,
        email,
        phsrc_certificate_image_url,
        verification_status,
        created_at
       FROM clinics
       WHERE clinic_id = $1`,
      [clinicId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ clinic: result.rows[0] });
  } catch (err) {
    console.error("/api/me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//  ADMIN 

// GET PENDING CLINICS
app.get("/api/admin/pending-clinics", async (req, res) => {
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

// APPROVE CLINIC
app.patch("/api/admin/approve-clinic/:id", async (req, res) => {
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

//  PRESCRIPTIONS 

// RECEIVE PRESCRIPTION FROM PATIENT BACKEND
app.post("/api/prescriptions/incoming", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No prescription image provided" });
    }

    const { patientName, medHiveId, hasExtractedData, medicines } = req.body;

    const blobName = `prescriptions/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.jpg`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    });

    const imageUrl = blockBlobClient.url;

    let medicinesData = [];
    if (hasExtractedData === "true" && medicines) {
      try {
        medicinesData =
          typeof medicines === "string" ? JSON.parse(medicines) : medicines;
      } catch (e) {
        console.error("Failed to parse medicines data:", e);
      }
    }

    const result = await pool.query(
      `INSERT INTO incoming_prescriptions
        (patient_name, medhive_id, prescription_image_url, medicines, has_extracted_data, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        patientName || "Unknown Patient",
        medHiveId || "N/A",
        imageUrl,
        JSON.stringify(medicinesData),
        hasExtractedData === "true",
        "pending",
      ]
    );

    return res.json({
      success: true,
      message: "Prescription received successfully",
      prescriptionId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error receiving prescription:", error);
    return res.status(500).json({ error: "Failed to receive prescription" });
  }
});

// GET PENDING PRESCRIPTIONS
app.get("/api/prescriptions/incoming", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        patient_name,
        medhive_id,
        prescription_image_url,
        medicines,
        has_extracted_data,
        received_at,
        status
       FROM incoming_prescriptions
       WHERE status = 'pending'
       ORDER BY received_at DESC`
    );

    return res.json({ prescriptions: result.rows });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// MARK PRESCRIPTION AS DISPENSED
app.patch("/api/prescriptions/:id/dispense", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE incoming_prescriptions
       SET status = 'dispensed'
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    return res.json({
      success: true,
      message: "Prescription marked as dispensed",
    });
  } catch (error) {
    console.error("Error dispensing prescription:", error);
    return res.status(500).json({ error: "Failed to dispense prescription" });
  }
});

//  CLINICS 

// GET VERIFIED CLINICS FOR PATIENT SELECTION
app.get("/api/clinics/verified", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT clinic_id, clinic_name, district, province
       FROM clinics
       WHERE verification_status = 'APPROVED'
       ORDER BY clinic_name ASC`
    );

    return res.json({ clinics: result.rows });
  } catch (error) {
    console.error("Error fetching verified clinics:", error);
    return res.status(500).json({ error: "Failed to fetch clinics" });
  }
});

//  START 
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});