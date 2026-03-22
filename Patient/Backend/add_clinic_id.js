require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

async function addClinicId() {
    try {
        console.log("Adding clinic_id to incoming_prescriptions...");
        
        // Add column if it doesn't exist
        await pool.query(`
            ALTER TABLE incoming_prescriptions 
            ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(clinic_id);
        `);
        
        console.log("Successfully added clinic_id column.");
    } catch (error) {
        console.error("Error adding column:", error);
    } finally {
        await pool.end();
    }
}

addClinicId();
