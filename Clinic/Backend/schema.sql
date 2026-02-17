-- Incoming Prescriptions Table for Clinic Backend
CREATE TABLE IF NOT EXISTS incoming_prescriptions (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    medhive_id VARCHAR(100),
    prescription_image_url TEXT NOT NULL,
    medicines JSONB DEFAULT '[]'::jsonb,
    has_extracted_data BOOLEAN DEFAULT false,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    CONSTRAINT status_check CHECK (status IN ('pending', 'dispensed'))
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_incoming_prescriptions_status ON incoming_prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_incoming_prescriptions_received_at ON incoming_prescriptions(received_at DESC);
