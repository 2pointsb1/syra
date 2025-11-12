/*
  # Add Public Access to Existing Tables

  1. Changes
    - Replace restrictive policies with permissive ones
    - Allow anonymous and authenticated access to all data
    
  2. Important Notes
    - This is TEMPORARY for development/demo purposes
    - In production, proper RLS policies should be restored
*/

-- Leads table
DROP POLICY IF EXISTS "Users can view leads in their organization" ON leads;
DROP POLICY IF EXISTS "Users can insert leads in their organization" ON leads;
DROP POLICY IF EXISTS "Users can update leads in their organization" ON leads;
DROP POLICY IF EXISTS "Users can delete leads in their organization" ON leads;

CREATE POLICY "Allow all access to leads"
  ON leads FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Lists table
DROP POLICY IF EXISTS "Users can view lists in their organization" ON lists;
DROP POLICY IF EXISTS "Users can insert lists in their organization" ON lists;
DROP POLICY IF EXISTS "Users can update lists in their organization" ON lists;
DROP POLICY IF EXISTS "Users can delete lists in their organization" ON lists;

CREATE POLICY "Allow all access to lists"
  ON lists FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Appointments table
DROP POLICY IF EXISTS "Users can view appointments in their organization" ON appointments;
DROP POLICY IF EXISTS "Users can insert appointments in their organization" ON appointments;
DROP POLICY IF EXISTS "Users can update appointments in their organization" ON appointments;
DROP POLICY IF EXISTS "Users can delete appointments in their organization" ON appointments;

CREATE POLICY "Allow all access to appointments"
  ON appointments FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Organizations table
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

CREATE POLICY "Allow all access to organizations"
  ON organizations FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Users table
DROP POLICY IF EXISTS "Users can view users in their organization" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

CREATE POLICY "Allow all access to users"
  ON users FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Api_keys table
DROP POLICY IF EXISTS "Users can view api_keys in their organization" ON api_keys;
DROP POLICY IF EXISTS "Users can insert api_keys in their organization" ON api_keys;
DROP POLICY IF EXISTS "Users can update api_keys in their organization" ON api_keys;
DROP POLICY IF EXISTS "Users can delete api_keys in their organization" ON api_keys;

CREATE POLICY "Allow all access to api_keys"
  ON api_keys FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);