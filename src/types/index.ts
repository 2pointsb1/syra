export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'gestion' | 'signataire' | 'indicateur_affaires';
  advisor_brochure_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  status: 'Sans statut' | 'NRP' | 'Nul' | 'À rappeler' | 'Intéressé' | 'RDV pris' | 'RDV honoré' | 'Signé' | 'RDV manqué' | 'Faux numéro' | 'Pas intéressé';
  nrp_count?: number;
  rdv_count?: number;
  owner?: string;
  owner_since?: string;
  status_updated_at?: string;
  status_updated_by?: string;
  imposition?: string;
  birth_year?: number;
  postal_code?: string;
  city?: string;
  profession?: string;
  residence_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  organization_id: string;
  name: string;
  type: 'importés' | 'manuels';
  lead_count: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  organization_id: string;
  lead_id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  google_calendar_id?: string;
  outlook_calendar_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_hash: string;
  key_preview: string;
  created_by: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

export interface KPI {
  totalLeads: number;
  toCallback: number;
  appointmentsTaken: number;
  signed: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface Contract {
  id: string;
  organization_id: string;
  lead_id?: string;
  client_name: string;
  contract_type: string;
  amount: number;
  status: 'pending' | 'validated' | 'rejected' | 'in_review';
  validation_date?: string;
  error_type?: 'missing_document' | 'invalid_iban' | 'invalid_proof' | 'signature_missing' | 'other' | null;
  is_reprise: boolean;
  reprise_success?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PredefinedMessage {
  id: string;
  title: string;
  content: string;
  category: 'description' | 'justification' | 'recommendation';
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type LibraryMainCategory = 'Contrats' | 'Bienviyance';
export type ContractSubCategory = 'PER' | 'Assurance Vie' | 'Prévoyance';
export type DocumentCategory = 'Contrats' | 'Bienviyance' | 'Prévoyance';
export type UploadCategory = 'Contrats' | 'Bienviyance';

export interface LibraryDocument {
  id: string;
  organization_id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  category: DocumentCategory;
  sub_category?: ContractSubCategory;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface MockLibraryDocument {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  category: DocumentCategory;
  sub_category?: ContractSubCategory;
  uploaded_at: string;
  uploaded_by: string;
}

export type MemoStatus = 'pending' | 'completed';

export interface Memo {
  id: string;
  organization_id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  due_time: string;
  status: MemoStatus;
  created_at: string;
  updated_at: string;
}

export type UserProfileType = 'Admin' | 'Manager' | 'Gestion' | 'Signataire' | 'Indicateur d\'affaires' | 'Marketing';

export interface UserProfile {
  id: string;
  profile_type: UserProfileType;
  first_name: string;
  last_name: string;
  email: string;
  photo_url?: string;
  team_manager_id?: string;
  is_active: boolean;
  advisor_brochure_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePermissions {
  canAccessDashboard: boolean;
  canAccessLeads: boolean;
  canAccessClients: boolean;
  canAccessAppointments: boolean;
  canAccessManagement: boolean;
  canAccessLibrary: boolean;
  canUploadLibraryDocuments: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAllLeads: boolean;
  canTransferLeads: boolean;
  canDeleteLeads: boolean;
  canManagePartners: boolean;
  canManageLogos: boolean;
  canViewAllStatuses: boolean;
}
