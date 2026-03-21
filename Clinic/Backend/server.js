require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Route Imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const prescriptionRoutes = require("./routes/prescriptions");
const clinicRoutes = require("./routes/clinics");
const meRoutes = require("./routes/me");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors"); // Your new doctor routes
const pool = require("./db");

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes); // Mounted doctor routes
app.use("/api", meRoutes);

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});