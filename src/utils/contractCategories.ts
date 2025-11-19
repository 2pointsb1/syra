export type ContractCategory = 'PER' | 'ASSURANCE_VIE' | 'MUTUELLE' | 'PREVOYANCE' | 'ASSURANCE_EMPRUNTEUR' | 'OTHER';

export interface ContractCategoryInfo {
  category: ContractCategory;
  displayName: string;
  color: string;
}

const PER_PRODUCTS = [
  'PER Generali',
  'Generali PER',
  'PER SwissLife',
  'SwissLife PER',
  'Signature PER',
  'MMA Signature PER',
  'MMA - Signature PER'
];

const ASSURANCE_VIE_PRODUCTS = [
  'Signature Actifs',
  'MMA Signature Actifs',
  'Omega',
  'SPVIE',
  'Omega (SPVIE)',
  'SCPI',
  'Girardin',
  'Star Invest',
  'Girardin - Star Invest',
  'Compte à Terme',
  'Épargne Platinium',
  'Generali Épargne Platinium',
  'Generali - Épargne Platinium'
];

const MUTUELLE_PRODUCTS = [
  'Plénitude',
  'Neoliane Plénitude',
  'Soutien Hospi',
  'Neoliane Soutien Hospi',
  'Alto Santé',
  'Neoliane Alto Santé',
  'Hospi Zen',
  'Neoliane Hospi Zen',
  'Hospi Santé',
  'Neoliane Hospi Santé',
  'Optima',
  'Neoliane Optima',
  'Obsèques',
  'Neoliane Obsèques',
  'SwissLife Mutuelle',
  'SwissLife - Mutuelle',
  'Entoria Mutuelle',
  'Entoria - Mutuelle',
  'April Mutuelle',
  'April - Mutuelle (individuelle)',
  'April - Mutuelle Collective',
  'Select Pro 30/10',
  'Alptis Select Pro 30/10',
  'Select Pro 40/10',
  'Alptis Select Pro 40/10',
  'Select Pro Linéaire',
  'Alptis Select Pro Linéaire',
  'UNIM Mutuelle',
  'UNIM - Mutuelle'
];

const PREVOYANCE_PRODUCTS = [
  'Tempo Décès',
  'Neoliane Tempo Décès',
  'Tempo Succès',
  'Neoliane Tempo Succès',
  'SwissLife Prévoyance',
  'SwissLife - Prévoyance',
  'Prévoyance du Pro',
  'Generali Prévoyance du Pro',
  'Generali - Prévoyance du Pro',
  'Entoria Prévoyance Collective',
  'Entoria - Prévoyance Collective',
  'Décennale',
  'Entoria Décennale',
  'Entoria - Décennale',
  'April Accident',
  'April - Accident',
  'April Prévoyance 30/10',
  'April - Prévoyance 30/10',
  'April Prévoyance 40/10',
  'April - Prévoyance 40/10',
  'Select Pro Prévoyance',
  'Alptis Select Pro Prévoyance',
  'UNIM Prévoyance',
  'UNIM - Prévoyance'
];

const ASSURANCE_EMPRUNTEUR_PRODUCTS = [
  'Zenioo Assurance Emprunteur',
  'Zenioo - Assurance Emprunteur',
  'April Assurance Emprunteur',
  'April - Assurance Emprunteur',
  'April IARD',
  'April - IARD'
];

export function getContractCategory(productName: string): ContractCategory {
  if (!productName) return 'OTHER';

  const normalizedProduct = productName.trim();

  if (PER_PRODUCTS.some(p => normalizedProduct.includes(p) || p.includes(normalizedProduct))) {
    return 'PER';
  }

  if (ASSURANCE_VIE_PRODUCTS.some(p => normalizedProduct.includes(p) || p.includes(normalizedProduct))) {
    return 'ASSURANCE_VIE';
  }

  if (MUTUELLE_PRODUCTS.some(p => normalizedProduct.includes(p) || p.includes(normalizedProduct))) {
    return 'MUTUELLE';
  }

  if (PREVOYANCE_PRODUCTS.some(p => normalizedProduct.includes(p) || p.includes(normalizedProduct))) {
    return 'PREVOYANCE';
  }

  if (ASSURANCE_EMPRUNTEUR_PRODUCTS.some(p => normalizedProduct.includes(p) || p.includes(normalizedProduct))) {
    return 'ASSURANCE_EMPRUNTEUR';
  }

  if (normalizedProduct.toLowerCase().includes('per')) {
    return 'PER';
  }

  if (normalizedProduct.toLowerCase().includes('mutuelle') || normalizedProduct.toLowerCase().includes('santé')) {
    return 'MUTUELLE';
  }

  if (normalizedProduct.toLowerCase().includes('prévoyance') || normalizedProduct.toLowerCase().includes('prevoyance')) {
    return 'PREVOYANCE';
  }

  if (normalizedProduct.toLowerCase().includes('emprunteur') || normalizedProduct.toLowerCase().includes('iard')) {
    return 'ASSURANCE_EMPRUNTEUR';
  }

  return 'OTHER';
}

export function getContractCategoryInfo(productName: string): ContractCategoryInfo {
  const category = getContractCategory(productName);

  switch (category) {
    case 'PER':
      return {
        category,
        displayName: 'Plan Épargne Retraite',
        color: 'blue'
      };
    case 'ASSURANCE_VIE':
      return {
        category,
        displayName: 'Assurance Vie / Épargne',
        color: 'green'
      };
    case 'MUTUELLE':
      return {
        category,
        displayName: 'Mutuelle Santé',
        color: 'orange'
      };
    case 'PREVOYANCE':
      return {
        category,
        displayName: 'Prévoyance',
        color: 'red'
      };
    case 'ASSURANCE_EMPRUNTEUR':
      return {
        category,
        displayName: 'Assurance Emprunteur',
        color: 'purple'
      };
    default:
      return {
        category,
        displayName: 'Autre',
        color: 'gray'
      };
  }
}

export function shouldShowPERExistantField(productName: string): boolean {
  return getContractCategory(productName) === 'PER';
}

export function shouldShowAssuranceVieExistanteField(productName: string): boolean {
  return getContractCategory(productName) === 'ASSURANCE_VIE';
}

export function shouldShowMutuelleReminder(productName: string): boolean {
  return getContractCategory(productName) === 'MUTUELLE';
}

export function shouldShowPrevoyanceRenouvellementField(productName: string): boolean {
  return getContractCategory(productName) === 'PREVOYANCE';
}

export function shouldShowAssuranceEmprunteurReminder(productName: string): boolean {
  return getContractCategory(productName) === 'ASSURANCE_EMPRUNTEUR';
}
