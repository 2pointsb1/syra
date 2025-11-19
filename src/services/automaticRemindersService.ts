import { createMemo } from './memosService';
import { getContractCategory, ContractCategory } from '../utils/contractCategories';

export interface ContractReminderData {
  produit: string;
  per_existant?: boolean;
  assurance_vie_existante?: boolean;
  rachat_effectue?: boolean;
  contrat_renouvellement_remplacement?: 'nouveau' | 'renouvellement' | 'remplacement' | '';
}

interface ReminderConfig {
  title: string;
  description: string | null;
  daysOffset: number;
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getDateWithOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getReminderForPER(contractData: ContractReminderData): ReminderConfig | null {
  if (contractData.per_existant) {
    return {
      title: 'Faire demande de transfert + suspension des versements sur l\'ancien PER',
      description: `Contrat concerné : ${contractData.produit}`,
      daysOffset: 0
    };
  }
  return null;
}

function getReminderForAssuranceVie(contractData: ContractReminderData): ReminderConfig | null {
  if (contractData.assurance_vie_existante && contractData.rachat_effectue) {
    return {
      title: 'Suivi du rachat total ou partiel',
      description: `Contrat concerné : ${contractData.produit}`,
      daysOffset: 0
    };
  }
  return null;
}

function getReminderForMutuelle(contractData: ContractReminderData): ReminderConfig {
  return {
    title: 'Avez-vous fait la RIA ?',
    description: `RIA (Résiliation Infra-Annuelle) - Contrat : ${contractData.produit}`,
    daysOffset: 0
  };
}

function getReminderForPrevoyance(contractData: ContractReminderData): ReminderConfig | null {
  const statut = contractData.contrat_renouvellement_remplacement;

  if (statut === 'renouvellement' || statut === 'remplacement') {
    return {
      title: 'Avez-vous effectué la RIA (résiliation ou non reconduction) ?',
      description: `Contrat en ${statut} : ${contractData.produit}`,
      daysOffset: 0
    };
  }
  return null;
}

function getReminderForAssuranceEmprunteur(contractData: ContractReminderData): ReminderConfig {
  return {
    title: 'Appeler le client pour vérification de l\'avenant bancaire',
    description: `Contrat concerné : ${contractData.produit}`,
    daysOffset: 21
  };
}

export async function createAutomaticReminder(
  contractData: ContractReminderData,
  userId: string,
  organizationId: string
): Promise<{ success: boolean; message: string; reminderCreated: boolean }> {
  try {
    const category = getContractCategory(contractData.produit);
    let reminderConfig: ReminderConfig | null = null;

    switch (category) {
      case 'PER':
        reminderConfig = getReminderForPER(contractData);
        break;

      case 'ASSURANCE_VIE':
        reminderConfig = getReminderForAssuranceVie(contractData);
        break;

      case 'MUTUELLE':
        reminderConfig = getReminderForMutuelle(contractData);
        break;

      case 'PREVOYANCE':
        reminderConfig = getReminderForPrevoyance(contractData);
        break;

      case 'ASSURANCE_EMPRUNTEUR':
        reminderConfig = getReminderForAssuranceEmprunteur(contractData);
        break;

      default:
        return {
          success: true,
          message: 'Aucun rappel automatique pour ce type de contrat',
          reminderCreated: false
        };
    }

    if (!reminderConfig) {
      return {
        success: true,
        message: 'Aucun rappel nécessaire pour cette configuration',
        reminderCreated: false
      };
    }

    const dueDate = getDateWithOffset(reminderConfig.daysOffset);
    const dueTime = getCurrentTime();

    await createMemo(
      userId,
      organizationId,
      reminderConfig.title,
      reminderConfig.description,
      dueDate,
      dueTime
    );

    let message = `Rappel automatique créé : "${reminderConfig.title}"`;
    if (reminderConfig.daysOffset > 0) {
      message += ` (prévu dans ${reminderConfig.daysOffset} jours)`;
    }

    return {
      success: true,
      message,
      reminderCreated: true
    };

  } catch (error) {
    console.error('Erreur lors de la création du rappel automatique:', error);
    return {
      success: false,
      message: 'Erreur lors de la création du rappel automatique',
      reminderCreated: false
    };
  }
}

export function getCategoryDisplayName(category: ContractCategory): string {
  switch (category) {
    case 'PER':
      return 'Plan Épargne Retraite';
    case 'ASSURANCE_VIE':
      return 'Assurance Vie / Épargne';
    case 'MUTUELLE':
      return 'Mutuelle Santé';
    case 'PREVOYANCE':
      return 'Prévoyance';
    case 'ASSURANCE_EMPRUNTEUR':
      return 'Assurance Emprunteur';
    default:
      return 'Autre';
  }
}
