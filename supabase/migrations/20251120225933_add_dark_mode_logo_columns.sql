/*
  # Ajout des colonnes pour les logos en mode sombre
  
  1. Modifications
    - Ajout de main_logo_dark_url
    - Ajout de collapsed_logo_dark_url
*/

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