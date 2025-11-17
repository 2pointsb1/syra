import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  profile_type: 'Admin' | 'Manager+' | 'Manager' | 'Conseiller';
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  team_manager_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfilePermissions {
  canAccessManagement: boolean;
  canViewAllData: boolean;
  canEditAllData: boolean;
  canViewTeamData: boolean;
  canEditOwnData: boolean;
  canViewSharedAppointments: boolean;
  canManagePartners: boolean;
  canEditEmailTemplates: boolean;
  canManageOrganizationSettings: boolean;
  canEditAdvisorPdf: boolean;
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('profile_type', { ascending: true });

  if (error) throw new Error(`Erreur lors du chargement des profils: ${error.message}`);
  return data || [];
}

export async function getActiveProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`Erreur lors du chargement du profil actif: ${error.message}`);
  return data;
}

export async function switchProfile(profileId: string): Promise<void> {
  await supabase
    .from('user_profiles')
    .update({ is_active: false })
    .eq('is_active', true);

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: true })
    .eq('id', profileId);

  if (error) throw new Error(`Erreur lors du changement de profil: ${error.message}`);
}

export function getProfilePermissions(profileType: string): ProfilePermissions {
  switch (profileType) {
    case 'Admin':
      return {
        canAccessManagement: true,
        canViewAllData: true,
        canEditAllData: true,
        canViewTeamData: true,
        canEditOwnData: true,
        canViewSharedAppointments: true,
        canManagePartners: true,
        canEditEmailTemplates: true,
        canManageOrganizationSettings: true,
        canEditAdvisorPdf: true,
      };
    case 'Manager+':
      return {
        canAccessManagement: true,
        canViewAllData: true,
        canEditAllData: true,
        canViewTeamData: true,
        canEditOwnData: true,
        canViewSharedAppointments: true,
        canManagePartners: true,
        canEditEmailTemplates: true,
        canManageOrganizationSettings: true,
        canEditAdvisorPdf: true,
      };
    case 'Manager':
      return {
        canAccessManagement: false,
        canViewAllData: false,
        canEditAllData: false,
        canViewTeamData: true,
        canEditOwnData: true,
        canViewSharedAppointments: true,
        canManagePartners: false,
        canEditEmailTemplates: false,
        canManageOrganizationSettings: false,
        canEditAdvisorPdf: false,
      };
    case 'Conseiller':
      return {
        canAccessManagement: false,
        canViewAllData: false,
        canEditAllData: false,
        canViewTeamData: false,
        canEditOwnData: true,
        canViewSharedAppointments: true,
        canManagePartners: false,
        canEditEmailTemplates: false,
        canManageOrganizationSettings: false,
        canEditAdvisorPdf: false,
      };
    default:
      return {
        canAccessManagement: false,
        canViewAllData: false,
        canEditAllData: false,
        canViewTeamData: false,
        canEditOwnData: true,
        canViewSharedAppointments: false,
        canManagePartners: false,
        canEditEmailTemplates: false,
        canManageOrganizationSettings: false,
        canEditAdvisorPdf: false,
      };
  }
}

export function getProfileBadgeColor(profileType: string): string {
  switch (profileType) {
    case 'Admin':
      return 'bg-red-100 text-red-700';
    case 'Manager+':
      return 'bg-blue-100 text-blue-700';
    case 'Manager':
      return 'bg-green-100 text-green-700';
    case 'Conseiller':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
