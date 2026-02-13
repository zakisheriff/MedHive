// server.js -AI-based medical classifier

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
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Gemini

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASSWORD,
  },
});

const pool = require("./db");

const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// GEMINI SETUP 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are MedHive, a specialized AI assistant for a medical clinic.

STRICT SCOPE:
- Only answer medical/health questions (symptoms, injuries, conditions, medications, prescriptions, pharmacy/medicine stock, human biology, tests, lifestyle health).
- If the user asks anything unrelated (coding, sports, movies, jokes, politics, math, poetry, stories), refuse briefly and redirect to health topics.

SAFETY:
- Do NOT provide definitive diagnoses.
- For emergencies (chest pain, severe breathing difficulty, stroke signs, severe bleeding, fainting, seizures, suicidal thoughts), tell the user to seek urgent medical care immediately.
- Be professional, empathetic, and concise.
- If information is insufficient, ask 1–3 medical follow-up questions.
`;

// RELIABILITY HELPERS
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, { retries = 3, baseDelay = 500 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const status = e?.status;

      // retry only on temporary overload / rate limit
      const retryable = status === 503 || status === 429;
      if (!retryable || attempt === retries) break;

      const delay = baseDelay * Math.pow(2, attempt); // 500, 1000, 2000...
      await sleep(delay);
    }
  }
  throw lastErr;
}

// Models to try (fallback if one is overloaded/blocked)
const MODEL_CANDIDATES = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

// AI MEDICAL CLASSIFIER (NO REGEX)
async function classifyMedical({ message, history }) {
  // Uses same fallback + retry as generation, but with a tiny prompt.
  // Returns true if MEDICAL, false if NON_MEDICAL.

  const context = (history || [])
    .slice(-12)
    .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
    .join("\n");

  const prompt = `
You are a strict classifier for a medical assistant.

Task:
- Decide if the user's message is medical/health-related OR a short follow-up in a medical conversation.
- Output ONLY one token: MEDICAL or NON_MEDICAL (no punctuation, no extra words).

Medical includes: symptoms, injuries, body parts, medications, prescriptions, side effects, tests, health concerns, mental health, follow-up answers like "sharp", "squeezing", "yes", "worse at night" if the context is medical.

Conversation context:
${context || "(none)"}

User message:
${message}
`.trim();

  let lastErr;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await withRetry(() => model.generateContent(prompt), {
        retries: 2,
        baseDelay: 400,
      });

      const raw = result?.response?.text?.() || "";
      const label = raw.trim().toUpperCase();

      // Strict parse
      if (label === "MEDICAL") return true;
      if (label === "NON_MEDICAL") return false;

      // If model returns anything weird, be safe: treat as NON_MEDICAL
      return false;
    } catch (e) {
      lastErr = e;
      if ([503, 429, 404].includes(e?.status)) continue;
      throw e;
    }
  }

  // If all models fail, throw so route can return friendly message
  throw lastErr;
}

//  AI RESPONSE GENERATOR 
async function generateMedReply({ message, history }) {
  let lastErr;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const chat = model.startChat({
        history: (history || []).slice(-12).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      });

      const result = await withRetry(() => chat.sendMessage(message), {
        retries: 3,
        baseDelay: 500,
      });

      const text = result?.response?.text?.()?.trim();
      if (text) return { text, modelName };
    } catch (e) {
      lastErr = e;
      if ([503, 429, 404].includes(e?.status)) continue;
      throw e;
    }
  }

  throw lastErr;
}

// ---------------- ZOD SCHEMAS ----------------
const registerSchema = z.object({
  clinicName: z.string().min(2).max(150),
  registrationNo: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72),
});

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "ai"]),
        text: z.string().min(1).max(2000),
      })
    )
    .optional(),
});

// ---------------- RATE LIMITER FOR CHAT ----------------
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
});

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ---------------- MULTER CONFIG ----------------
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

// ---------------- HEALTH CHECK ----------------
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// ---------------- CHATBOT ROUTE (AI CLASSIFIER) ----------------
app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parsed.error.issues });
    }

    const { message, history = [] } = parsed.data;

    // 1) Decide medical vs non-medical using AI classifier (no regex list)
    const isMedical = await classifyMedical({ message, history });

    if (!isMedical) {
      return res.json({
        reply:
          "I’m designed to help with medical and health-related questions only. Please ask about symptoms, injuries, medications, prescriptions, or health concerns.",
      });
    }

    // 2) Generate medical response (with retry + fallback)
    const { text } = await generateMedReply({ message, history });

    // 3) Optional drift guard (cheap safety net)
    const offTopicRegex =
      /(javascript|react|node|code|football|cricket|politics|movie|song|joke|poem|story|math)/i;

    if (offTopicRegex.test(text)) {
      return res.json({
        reply:
          "I can only assist with medical and health-related topics. Please ask a health question.",
      });
    }

    return res.json({ reply: text });
  } catch (error) {
    console.error("Error generating response:", error);

    if (error?.status === 503) {
      return res.status(503).json({
        reply:
          "The AI service is experiencing high demand right now. Please try again in a moment.",
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        reply:
          "The AI service is temporarily rate-limited. Please try again in about a minute.",
      });
    }

    return res.status(500).json({ error: "Failed to process your request." });
  }
});

// AUTH ROUTES 
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
      to: email.toLowerCase(),
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

// PATCH approve clinic
app.patch("/api/admin/approve-clinic/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE clinics SET verification_status = 'APPROVED' WHERE clinic_id = $1 RETURNING clinic_name, email",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Clinic not found" });

    const clinic = result.rows[0];

    await transporter.sendMail({
      from: `"MedHive Team" <${process.env.MEDHIVE_EMAIL}>`,
      to: clinic.email,
      subject: "MedHive Account Approved!",
      text: `Congratulations ${clinic.clinic_name}! Your MedHive account has been approved. You can now log in to the dashboard.`,
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

  res.json({ clinic: r.rows[0] });
});

// Start
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
