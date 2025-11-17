/*
  # Migration des catégories de documents de bibliothèque
  
  1. Modifications
    - Mise à jour de la contrainte CHECK sur library_documents.category
    - Migration des données: 'PER' devient 'Contrats'
    - Migration des données: 'Assurance Vie' devient 'Prévoyance'
    - Ajout de la nouvelle catégorie 'Bienviyance'
  
  2. Notes
    - Les données existantes sont préservées
    - La migration est idempotente
*/

-- Supprimer l'ancienne contrainte CHECK
ALTER TABLE library_documents DROP CONSTRAINT IF EXISTS library_documents_category_check;

-- Migrer les données existantes
UPDATE library_documents SET category = 'Contrats' WHERE category = 'PER';
UPDATE library_documents SET category = 'Prévoyance' WHERE category = 'Assurance Vie';

-- Ajouter la nouvelle contrainte CHECK avec les nouvelles catégories
ALTER TABLE library_documents 
  ADD CONSTRAINT library_documents_category_check 
  CHECK (category IN ('Contrats', 'Bienviyance', 'Prévoyance'));