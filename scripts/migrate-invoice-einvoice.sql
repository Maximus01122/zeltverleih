-- Optional e-invoice (ZUGFeRD / XRechnung) fields on invoice
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS einvoice BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS einvoice_xml BYTEA;
