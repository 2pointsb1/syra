/*
  # Add Dark Mode Logo Support

  1. Changes
    - Add `main_logo_dark_url` column to store the dark mode main logo
    - Add `collapsed_logo_dark_url` column to store the dark mode collapsed logo

  2. Details
    - Both columns are nullable text fields
    - Allow organizations to have separate logos for dark mode
    - Maintains backward compatibility with existing light mode logos
*/

-- Add dark mode logo columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organization_settings' AND column_name = 'main_logo_dark_url'
  ) THEN
    ALTER TABLE organization_settings ADD COLUMN main_logo_dark_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organization_settings' AND column_name = 'collapsed_logo_dark_url'
  ) THEN
    ALTER TABLE organization_settings ADD COLUMN collapsed_logo_dark_url text;
  END IF;
END $$;
