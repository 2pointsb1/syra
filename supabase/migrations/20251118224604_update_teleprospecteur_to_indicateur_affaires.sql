/*
  # Mise à jour du rôle Téléprospecteur vers Indicateur d'affaires

  1. Modifications
    - Supprime temporairement la contrainte de vérification sur profile_type
    - Met à jour tous les utilisateurs ayant le rôle "Téléprospecteur" vers "Indicateur d'affaires"
    - Recrée la contrainte avec la nouvelle liste de rôles incluant "Indicateur d'affaires"
  
  2. Notes importantes
    - Cette migration est idempotente et peut être exécutée plusieurs fois
    - Le changement de nom affecte tous les profils utilisateurs existants
*/

-- Supprimer l'ancienne contrainte
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_profile_type_check' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_profile_type_check;
  END IF;
END $$;

-- Mettre à jour tous les profils "Téléprospecteur" vers "Indicateur d'affaires"
UPDATE user_profiles 
SET profile_type = 'Indicateur d''affaires' 
WHERE profile_type = 'Téléprospecteur';

-- Ajouter la nouvelle contrainte avec "Indicateur d'affaires"
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_profile_type_check 
CHECK (profile_type IN ('Admin', 'Manager', 'Gestion', 'Signataire', 'Indicateur d''affaires', 'Marketing'));
