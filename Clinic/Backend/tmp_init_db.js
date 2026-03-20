const pool = require('./db');

async function initDB() {
  const query = `
    CREATE TABLE IF NOT EXISTS patient_access_codes (
      id SERIAL PRIMARY KEY,
      med_id VARCHAR(100) NOT NULL,
      otp VARCHAR(2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_patient_access_codes_med_id ON patient_access_codes(med_id);
    CREATE INDEX IF NOT EXISTS idx_patient_access_codes_expires_at ON patient_access_codes(expires_at);
  `;
  try {
    await pool.query(query);
    console.log("✅ patient_access_codes table created successfully!");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  } finally {
    process.exit();
  }
}

initDB();
