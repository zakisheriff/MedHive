import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   REGISTER API
   ========================= */
app.post('/api/register', async (req, res) => {
  const {
    companyName,
    registrationNumber,
    email,
    contactNumber,
    address,
    addressPostalCode,
    nmraLicenseNumber,
    licenseExpiryDate,
    password
  } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO pharma_companies (
        company_name,
        company_reg_no,
        contact_email,
        contact_number,
        address,
        address_postal_code,
        address_passcode,
        nmra_license_no,
        license_expiry_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING pharma_id
    `;

    const values = [
      companyName,
      registrationNumber,
      email,
      contactNumber,
      address,
      addressPostalCode,
      hashedPassword,
      nmraLicenseNumber,
      licenseExpiryDate
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Registration successful",
      pharmaId: result.rows[0].pharma_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* =========================
   LOGIN API
   ========================= */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `
      SELECT pharma_id, company_name, contact_email, address_passcode
      FROM pharma_companies
      WHERE contact_email = $1 AND is_active = true
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.address_passcode);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        pharmaId: user.pharma_id,
        companyName: user.company_name,
        email: user.contact_email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
 