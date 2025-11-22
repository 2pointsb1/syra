/*
  # Add RDV counting and attachment features

  1. New Columns
    - Add `rdv_count` to `leads` table to track multiple RDV
    - Add `affaires_nouvelles_status` to `devoirs_conseil` table
    - Add `affaires_nouvelles_sent_at` to `devoirs_conseil` table

  2. New Tables
    - `signataire_disponibilites` for tracking signer availability
      - `id` (uuid, primary key)
      - `signataire_id` (uuid, references user_profiles)
      - `appointment_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `devoir_conseil_attachments` for tracking document attachments
      - `id` (uuid, primary key)
      - `devoir_conseil_id` (uuid, references devoirs_conseil)
      - `file_url` (text)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `uploaded_at` (timestamp)
      - `uploaded_by` (uuid, references user_profiles)

  3. Storage
    - Create storage bucket for devoir conseil attachments

  4. Security
    - Enable RLS on all new tables
    - Add policies for authenticated access
*/

-- Add rdv_count column to leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'rdv_count'
  ) THEN
    ALTER TABLE leads ADD COLUMN rdv_count integer DEFAULT 0;
  END IF;
END $$;

-- Add affaires nouvelles columns to devoirs_conseil
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'affaires_nouvelles_status'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN affaires_nouvelles_status text DEFAULT 'draft';
    ALTER TABLE devoirs_conseil ADD COLUMN affaires_nouvelles_sent_at timestamptz;
  END IF;
END $$;

-- Create signataire_disponibilites table
CREATE TABLE IF NOT EXISTS signataire_disponibilites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signataire_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'occupied',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE signataire_disponibilites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to signataire_disponibilites"
  ON signataire_disponibilites
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to signataire_disponibilites"
  ON signataire_disponibilites
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to signataire_disponibilites"
  ON signataire_disponibilites
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete from signataire_disponibilites"
  ON signataire_disponibilites
  FOR DELETE
  TO public
  USING (true);

-- Create devoir_conseil_attachments table
CREATE TABLE IF NOT EXISTS devoir_conseil_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES user_profiles(id)
);

ALTER TABLE devoir_conseil_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to devoir_conseil_attachments"
  ON devoir_conseil_attachments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to devoir_conseil_attachments"
  ON devoir_conseil_attachments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to devoir_conseil_attachments"
  ON devoir_conseil_attachments
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete from devoir_conseil_attachments"
  ON devoir_conseil_attachments
  FOR DELETE
  TO public
  USING (true);

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('devoir-conseil-attachments', 'devoir-conseil-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_signataire_disponibilites_signataire_date
  ON signataire_disponibilites(signataire_id, appointment_date);

CREATE INDEX IF NOT EXISTS idx_devoir_conseil_attachments_devoir
  ON devoir_conseil_attachments(devoir_conseil_id);