import { supabase } from '../lib/supabase';
import { UserProfile, ProfilePermissions } from '../types';

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
        canAccessDashboard: true,
        canAccessLeads: true,
        canAccessClients: true,
        canAccessAppointments: true,
        canAccessManagement: true,
        canAccessLibrary: true,
        canUploadLibraryDocuments: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAllLeads: true,
        canTransferLeads: true,
        canDeleteLeads: true,
      };
    case 'Manager':
      return {
        canAccessDashboard: true,
        canAccessLeads: true,
        canAccessClients: true,
        canAccessAppointments: true,
        canAccessManagement: true,
        canAccessLibrary: true,
        canUploadLibraryDocuments: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAllLeads: true,
        canTransferLeads: true,
        canDeleteLeads: true,
      };
    case 'Gestion':
      return {
        canAccessDashboard: true,
        canAccessLeads: true,
        canAccessClients: true,
        canAccessAppointments: true,
        canAccessManagement: true,
        canAccessLibrary: true,
        canUploadLibraryDocuments: true,
        canManageUsers: false,
        canManageSettings: false,
        canViewAllLeads: true,
        canTransferLeads: true,
        canDeleteLeads: false,
      };
    case 'Signataire':
      return {
        canAccessDashboard: true,
        canAccessLeads: true,
        canAccessClients: true,
        canAccessAppointments: true,
        canAccessManagement: false,
        canAccessLibrary: true,
        canUploadLibraryDocuments: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewAllLeads: false,
        canTransferLeads: false,
        canDeleteLeads: false,
      };
    case 'Indicateur d\'affaires':
      return {
        canAccessDashboard: true,
        canAccessLeads: true,
        canAccessClients: true,
        canAccessAppointments: true,
        canAccessManagement: false,
        canAccessLibrary: true,
        canUploadLibraryDocuments: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewAllLeads: false,
        canTransferLeads: false,
        canDeleteLeads: false,
      };
    case 'Marketing':
      return {
        canAccessDashboard: false,
        canAccessLeads: false,
        canAccessClients: false,
        canAccessAppointments: false,
        canAccessManagement: false,
        canAccessLibrary: true,
        canUploadLibraryDocuments: true,
        canManageUsers: false,
        canManageSettings: false,
        canViewAllLeads: false,
        canTransferLeads: false,
        canDeleteLeads: false,
      };
    default:
      return {
        canAccessDashboard: false,
        canAccessLeads: false,
        canAccessClients: false,
        canAccessAppointments: false,
        canAccessManagement: false,
        canAccessLibrary: false,
        canUploadLibraryDocuments: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewAllLeads: false,
        canTransferLeads: false,
        canDeleteLeads: false,
      };
  }
}

export function getProfileBadgeColor(profileType: string): string {
  switch (profileType) {
    case 'Admin':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Manager':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Gestion':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Signataire':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Indicateur d\'affaires':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Marketing':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
