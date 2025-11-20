/*
  # Création de la table organization_settings
  
  1. Table organization_settings
    - Paramètres de l'organisation
    - Logos, templates email, etc.
  
  2. Sécurité
    - RLS activé
    - Accès authentifié
*/

CREATE TABLE IF NOT EXISTS organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL,
  main_logo_url text,
  collapsed_logo_url text,
  email_template_content text,
  email_first_attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read organization settings" ON organization_settings;
CREATE POLICY "Authenticated users can read organization settings"
  ON organization_settings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read organization settings" ON organization_settings;
CREATE POLICY "Public can read organization settings"
  ON organization_settings FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update organization settings" ON organization_settings;
CREATE POLICY "Authenticated users can update organization settings"
  ON organization_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can insert organization settings" ON organization_settings;
CREATE POLICY "Authenticated users can insert organization settings"
  ON organization_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO organization_settings (organization_id, email_template_content, email_first_attachment_url)
VALUES (
  gen_random_uuid(),
  'Bienvenue chez BIENVIYANCE, votre partenaire de confiance en matière de courtage en assurance et de family office dédié à votre protection sociale et votre épargne.
Chez Bienviyance, notre mission première est de placer votre bien-être financier et celui de votre famille au cœur de nos préoccupations.

Nous comprenons que chaque individu a des besoins uniques en matière d''assurance et d''épargne, c''est pourquoi nous mettons en œuvre notre expertise pointue pour vous offrir des solutions sur mesure, parfaitement adaptées à votre situation.

Que ce soit pour assurer l''avenir de vos proches, préparer votre retraite en toute sérénité, ou encore optimiser votre patrimoine, nous mettons à votre disposition une gamme complète de produits et de stratégies personnalisées.

Avec nous, vous bénéficierez de conseils éclairés, d''une analyse approfondie de vos besoins et de solutions innovantes pour protéger ce qui compte le plus pour vous.

Nous nous efforçons de vous offrir la meilleure couverture au meilleur prix, tout en vous donnant les clés pour faire fructifier votre épargne et sécuriser votre avenir financier.

Faites le choix de la Bienviyance envers votre patrimoine et votre famille.',
  'Moche Azran BNVCE.pdf'
)
ON CONFLICT (organization_id) DO NOTHING;