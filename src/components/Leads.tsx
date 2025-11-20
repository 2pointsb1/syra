import { Search, Filter, CircleUser as UserCircle, List, Grid2x2 as Grid, LayoutGrid, ChevronRight, CalendarDays, Copy, Plus, MessageSquare, Globe, FileText, X, Bell, BellRing, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Lead } from '../types';
import ReminderModal from './ReminderModal';
import CalendarSyncModal from './CalendarSyncModal';
import AddAppointmentFromLeadModal from './AddAppointmentFromLeadModal';
import LeadCommentsModal from './LeadCommentsModal';

const baseMockLeads: Lead[] = [
  {
    id: '1',
    organization_id: '1',
    first_name: 'Madame',
    last_name: 'DAHCHAR',
    email: 'dahchar@icloud.com',
    phone: '0781170861',
    status: 'NRP',
    owner: 'Marie Dubois',
    owner_since: '2025-09-15',
    imposition: '+2500€',
    birth_year: 2000,
    postal_code: '69600',
    city: 'Oullins',
    profession: '',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '2',
    organization_id: '1',
    first_name: 'Monsieur',
    last_name: 'DUPART',
    email: 'dupart33@gmail.com',
    phone: '0688523264',
    status: 'Sans statut',
    owner: 'Jean Martin',
    owner_since: '2025-08-20',
    imposition: '+2500€',
    birth_year: 1943,
    postal_code: '33000',
    city: 'Bordeaux',
    profession: '',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '3',
    organization_id: '1',
    first_name: 'Yannick',
    last_name: 'GOASDOUE',
    email: 'nikenyan0@gmail.com',
    phone: '0687180650',
    status: 'À rappeler',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1976,
    postal_code: '22290',
    city: 'Lanvollon',
    profession: '',
    residence_status: '',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '4',
    organization_id: '1',
    first_name: 'Emilie',
    last_name: 'LECOURT',
    email: 'elecourt@laposte.net',
    phone: '0673183510',
    status: 'RDV pris',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1985,
    postal_code: '27450',
    city: 'Saint-Grégoire-du-Vièvre',
    profession: '',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '5',
    organization_id: '1',
    first_name: 'Sophie',
    last_name: 'MARTIN',
    email: 'sophie.martin@outlook.fr',
    phone: '0612345678',
    status: 'Signé',
    owner: 'Marie Dubois',
    owner_since: '2025-09-10',
    imposition: '+2500€',
    birth_year: 1990,
    postal_code: '75001',
    city: 'Paris',
    profession: 'Ingénieur',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '6',
    organization_id: '1',
    first_name: 'Thomas',
    last_name: 'BERNARD',
    email: 'thomas.bernard@gmail.com',
    phone: '0698765432',
    status: 'NRP',
    owner: 'Jean Martin',
    owner_since: '2025-08-20',
    imposition: '+2500€',
    birth_year: 1988,
    postal_code: '69002',
    city: 'Lyon',
    profession: 'Comptable',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '7',
    organization_id: '1',
    first_name: 'Julie',
    last_name: 'DUBOIS',
    email: 'julie.dubois@yahoo.fr',
    phone: '0623456789',
    status: 'À rappeler',
    owner: 'Marie Dubois',
    owner_since: '2025-09-10',
    imposition: '+2500€',
    birth_year: 1995,
    postal_code: '13001',
    city: 'Marseille',
    profession: 'Avocat',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '8',
    organization_id: '1',
    first_name: 'Pierre',
    last_name: 'LEFEBVRE',
    email: 'p.lefebvre@hotmail.com',
    phone: '0634567890',
    status: 'Sans statut',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1982,
    postal_code: '44000',
    city: 'Nantes',
    profession: 'Médecin',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '9',
    organization_id: '1',
    first_name: 'Marie',
    last_name: 'MOREAU',
    email: 'marie.moreau@orange.fr',
    phone: '0645678901',
    status: 'RDV pris',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1987,
    postal_code: '59000',
    city: 'Lille',
    profession: 'Architecte',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '10',
    organization_id: '1',
    first_name: 'Lucas',
    last_name: 'SIMON',
    email: 'lucas.simon@free.fr',
    phone: '0656789012',
    status: 'Signé',
    owner: 'Marie Dubois',
    owner_since: '2025-09-10',
    imposition: '+2500€',
    birth_year: 1992,
    postal_code: '31000',
    city: 'Toulouse',
    profession: 'Consultant',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '11',
    organization_id: '1',
    first_name: 'Camille',
    last_name: 'LAURENT',
    email: 'camille.laurent@sfr.fr',
    phone: '0667890123',
    status: 'NRP',
    owner: 'Jean Martin',
    owner_since: '2025-08-20',
    imposition: '+2500€',
    birth_year: 1993,
    postal_code: '67000',
    city: 'Strasbourg',
    profession: 'Enseignant',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '12',
    organization_id: '1',
    first_name: 'Nicolas',
    last_name: 'ROUX',
    email: 'n.roux@bbox.fr',
    phone: '0678901234',
    status: 'À rappeler',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1985,
    postal_code: '35000',
    city: 'Rennes',
    profession: 'Pharmacien',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '13',
    organization_id: '1',
    first_name: 'Laura',
    last_name: 'GARNIER',
    email: 'laura.garnier@laposte.net',
    phone: '0689012345',
    status: 'Sans statut',
    owner: 'Marie Dubois',
    owner_since: '2025-09-10',
    imposition: '+2500€',
    birth_year: 1991,
    postal_code: '06000',
    city: 'Nice',
    profession: 'Designer',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '14',
    organization_id: '1',
    first_name: 'Alexandre',
    last_name: 'FAURE',
    email: 'alex.faure@icloud.com',
    phone: '0690123456',
    status: 'RDV pris',
    owner: 'Sophie Laurent',
    owner_since: '2025-09-01',
    imposition: '+2500€',
    birth_year: 1989,
    postal_code: '34000',
    city: 'Montpellier',
    profession: 'Directeur',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '15',
    organization_id: '1',
    first_name: 'Léa',
    last_name: 'GIRARD',
    email: 'lea.girard@gmail.com',
    phone: '0601234567',
    status: 'Signé',
    owner: 'Jean Martin',
    owner_since: '2025-08-20',
    imposition: '+2500€',
    birth_year: 1994,
    postal_code: '76000',
    city: 'Rouen',
    profession: 'Chef de projet',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

// Generate additional leads to have 75 total (3 pages of 25)
const generateMockLeads = (): Lead[] => {
  const leads = [...baseMockLeads];
  const firstNames = ['Sophie', 'Lucas', 'Emma', 'Thomas', 'Julie', 'Pierre', 'Marie', 'Antoine', 'Chloe', 'Nicolas', 'Laura', 'Alexandre', 'Camille', 'Julien', 'Sarah'];
  const lastNames = ['MARTIN', 'BERNARD', 'DUBOIS', 'THOMAS', 'ROBERT', 'RICHARD', 'PETIT', 'DURAND', 'LEROY', 'MOREAU', 'SIMON', 'LAURENT', 'LEFEBVRE', 'MICHEL', 'GARCIA'];
  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Etienne', 'Toulon'];
  const statuses = ['NRP', 'Sans statut', 'À rappeler', 'RDV pris', 'Signé'];
  const priorities = ['faible', 'moyenne', 'haute'];

  const owners = ['Marie Dubois', 'Jean Martin', 'Sophie Laurent', 'Pierre Durand'];
  const ownerDates = ['2025-08-20', '2025-09-01', '2025-09-10', '2025-09-15'];

  for (let i = baseMockLeads.length; i < 75; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const ownerIndex = Math.floor(Math.random() * owners.length);
    const owner = owners[ownerIndex];
    const owner_since = ownerDates[ownerIndex];

    leads.push({
      id: `${i + 1}`,
      organization_id: '1',
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      status,
      owner,
      owner_since,
      imposition: '+2500€',
      birth_year: 1950 + Math.floor(Math.random() * 50),
      postal_code: `${Math.floor(Math.random() * 95000) + 1000}`,
      city,
      profession: '',
      residence_status: Math.random() > 0.5 ? 'Proprietaire' : 'Locataire',
      created_at: '2025-10-02',
      updated_at: '2025-10-02',
    });
  }

  return leads;
};

const mockLeads = generateMockLeads();

function LeadCard({ lead, onUpdate, showOwner }: { lead: Lead; onUpdate: (leadId: string, updates: Partial<Lead>) => void; showOwner?: boolean }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localLead, setLocalLead] = useState(lead);


  const handleStatusChange = (status: string) => {
    const updates: Partial<Lead> = { status };

    if (status === 'NRP') {
      updates.nrp_count = (localLead.nrp_count || 0) + 1;
    }

    if (status === 'RDV pris') {
      setShowStatusMenu(false);
      setShowAppointmentModal(true);
      setLocalLead({ ...localLead, ...updates });
      onUpdate(lead.id, updates);
      return;
    }

    setLocalLead({ ...localLead, ...updates });
    onUpdate(lead.id, updates);
    setShowStatusMenu(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatOwnershipDate = (ownerSince?: string) => {
    if (!ownerSince) return null;
    const date = new Date(ownerSince);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'NRP':
        return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200/50';
      case 'Sans statut':
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50';
      case 'À rappeler':
        return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50';
      case 'RDV pris':
        return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200/50';
      case 'Signé':
        return 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50';
    }
  };

  return (
    <div className="glass-card glass-card-hover floating-shadow">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white font-light shadow-lg flex-shrink-0">
              {getInitials(lead.first_name, lead.last_name)}
            </div>
            <div>
              <h3 className="font-light text-gray-900 text-base md:text-lg">{lead.first_name} {lead.last_name}</h3>
              <div className="flex flex-col gap-1 mt-1">
                {lead.status_updated_at && lead.status_updated_by ? (
                  <span className="text-xs text-gray-500 font-light">
                    Statut mis à jour le {new Date(lead.status_updated_at).toLocaleDateString('fr-FR')} par {lead.status_updated_by}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500 font-light">
                    <span className="hidden sm:inline">Mis à jour: {new Date(lead.updated_at).toLocaleDateString('fr-FR')}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => setShowAppointmentModal(true)} className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
              <CalendarDays className="w-4 h-4 text-gray-600 dark:text-[#101828]" />
            </button>
            <button onClick={() => setShowReminderModal(true)} className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
              <BellRing className="w-4 h-4 text-gray-600 dark:text-[#101828]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs md:text-sm text-gray-600 font-light whitespace-nowrap">Statut</span>
          </div>
          <div className="flex items-center gap-2 relative flex-1 sm:flex-none">
            <span
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border cursor-pointer hover:opacity-80 transition-opacity ${getStatusStyle(localLead.status)}`}
            >
              {localLead.status === 'NRP' && localLead.nrp_count && localLead.nrp_count > 0 && (
                <span className="mr-1.5">+{localLead.nrp_count}</span>
              )}
              {localLead.status}
            </span>
            {showStatusMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-10 min-w-max">
                <button onClick={() => handleStatusChange('NRP')} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-orange-50 text-orange-700">NRP</button>
                <button onClick={() => handleStatusChange('Sans statut')} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-gray-50 text-gray-700">Sans statut</button>
                <button onClick={() => handleStatusChange('À rappeler')} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-blue-50 text-blue-700">À rappeler</button>
                <button onClick={() => handleStatusChange('RDV pris')} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-purple-50 text-purple-700">RDV pris</button>
                <button onClick={() => handleStatusChange('Signé')} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-green-50 text-green-700">Signé</button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-xs md:text-sm font-light text-gray-900 mb-3">Informations du contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Téléphone</span>
              <span className="text-sm text-gray-900 font-light">{lead.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Ville</span>
              <span className="text-sm text-gray-900 font-light">{lead.city || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Email</span>
              <span className="text-sm text-gray-900 font-light truncate ml-2">{lead.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Département</span>
              <span className="text-sm text-gray-900 font-light">
                {lead.postal_code ? `${lead.postal_code.substring(0, 2)}` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Année de naissance</span>
              <span className="text-sm text-gray-900 font-light">{lead.birth_year || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Imposition</span>
              <span className="text-sm text-gray-900 font-light">{lead.imposition || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Statut de résidence</span>
              <span className="text-sm text-gray-900 font-light">{lead.residence_status || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 font-light">Code postal</span>
              <span className="text-sm text-gray-900 font-light">{lead.postal_code || '-'}</span>
            </div>
            {showOwner && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 font-light">Propriétaire</span>
                  <span className="text-sm text-gray-900 font-light">{lead.owner || '-'}</span>
                </div>
                {lead.owner_since && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 font-light">Date de propriété</span>
                    <span className="text-sm text-gray-900 font-light">{formatOwnershipDate(lead.owner_since)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          {!showCommentInput ? (
            <button
              onClick={() => setShowCommentInput(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ajouter un commentaire</span>
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrivez votre commentaire..."
                className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowCommentInput(false);
                    setCommentText('');
                  }}
                  className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (commentText.trim()) {
                      console.log('Commentaire ajouté:', commentText);
                      setCommentText('');
                      setShowCommentInput(false);
                    }
                  }}
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Envoyer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReminderModal && <ReminderModal lead={localLead} onClose={() => setShowReminderModal(false)} />}
      {showCalendarModal && <CalendarSyncModal onClose={() => setShowCalendarModal(false)} />}
      {showAppointmentModal && <AddAppointmentFromLeadModal lead={localLead} onClose={() => setShowAppointmentModal(false)} />}
      {showCommentsModal && (
        <LeadCommentsModal
          leadId={lead.id}
          leadName={`${lead.first_name} ${lead.last_name}`}
          onClose={() => setShowCommentsModal(false)}
        />
      )}
    </div>
  );
}

interface LeadsProps {
  onNotificationClick: () => void;
  notificationCount: number;
  initialFilter?: string | null;
}

export default function Leads({ onNotificationClick, notificationCount, initialFilter }: LeadsProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter || 'Tous les statuts');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [region, setRegion] = useState('Toute la France');
  const [department, setDepartment] = useState('');
  const [nrpMin, setNrpMin] = useState('');
  const [nrpMax, setNrpMax] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialFilter || '');
  const [editingCell, setEditingCell] = useState<{ leadId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [leadViewMode, setLeadViewMode] = useState<'conseiller' | 'manager'>('conseiller');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadForAppointment, setSelectedLeadForAppointment] = useState<Lead | null>(null);
  const [showAppointmentModalForLead, setShowAppointmentModalForLead] = useState(false);
  const leadsPerPage = 25;

  const handleLeadUpdate = (leadId: string, updates: Partial<Lead>) => {
    const updatedLeadData: Partial<Lead> = { ...updates };

    if (updates.status) {
      updatedLeadData.status_updated_at = new Date().toISOString();
      updatedLeadData.status_updated_by = 'Marie Dubois';
    }

    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, ...updatedLeadData } : lead));
  };

  const filteredLeads = leads.filter(lead => {
    if (selectedStatus !== 'Tous les statuts' && lead.status !== selectedStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const handleCellEdit = (leadId: string, field: string, currentValue: string) => {
    setEditingCell({ leadId, field });
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilterName('');
    setFilterProduct('');
    setFilterStatus('');
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Leads</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gérez et suivez vos prospects efficacement</p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>


      <div className="p-4 md:p-6 lg:p-8">
        <div className="glass-card floating-shadow overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="mb-4 md:mb-6">
              <div className="flex gap-2 md:gap-4 overflow-x-auto">
                <button className="px-4 md:px-5 py-2 text-xs md:text-sm font-light text-gray-900 bg-white rounded-full shadow-sm whitespace-nowrap">
                  Particuliers
                </button>
                <button className="px-4 md:px-5 py-2 text-xs md:text-sm font-light text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all whitespace-nowrap">
                  Chefs d'entreprise
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Recherche"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="hidden md:block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light flex-shrink-0"
          >
            <option>Tous les statuts</option>
            <option>NRP</option>
            <option>Sans statut</option>
            <option>À rappeler</option>
            <option>RDV pris</option>
            <option>Signé</option>
          </select>

          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto ml-auto">
            <button
              onClick={() => setLeadViewMode('conseiller')}
              className={`w-9 h-9 rounded-full ${leadViewMode === 'conseiller' ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white shadow-sm'} flex items-center justify-center transition-all hover:scale-105 flex-shrink-0 hidden md:flex`}
              title="Vue Conseillère"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-[#101828]" />
            </button>
            <button
              onClick={() => setLeadViewMode('manager')}
              className={`w-9 h-9 rounded-full ${leadViewMode === 'manager' ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white shadow-sm'} flex items-center justify-center transition-all hover:scale-105 flex-shrink-0 hidden md:flex`}
              title="Vue Manager"
            >
              <Users className="w-5 h-5 text-gray-600 dark:text-[#101828]" />
            </button>
            <button
              className={`w-9 h-9 rounded-full ${viewMode === 'table' ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white shadow-sm'} flex items-center justify-center transition-all hover:scale-105 flex-shrink-0`}
              onClick={() => setViewMode('table')}
            >
              <List className="w-5 h-5 text-gray-600 dark:text-[#101828]" />
            </button>
            <button
              className={`w-9 h-9 rounded-full ${viewMode === 'cards' ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white shadow-sm'} flex items-center justify-center transition-all hover:scale-105 flex-shrink-0`}
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-[#101828]" />
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 md:px-4 py-2 bg-white/80 border border-gray-200 rounded-full text-xs md:text-sm hover:bg-white transition-all flex items-center gap-2 font-light flex-shrink-0 whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {(filterName || filterProduct || filterStatus) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
          </div>

          {showFilters && (
            <>
              <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[100]" onClick={() => setShowFilters(false)} />
              <div className="fixed inset-0 flex items-start justify-center z-[110] p-4 pt-12">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[600px]">
                <div className="p-6 border-b border-gray-200/30 flex items-center justify-between">
                  <h2 className="text-xl font-light text-gray-900">Filtres</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserCircle className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-light text-gray-700">Âge</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Age Min." value={ageMin} onChange={(e) => setAgeMin(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light" />
                  <input type="text" placeholder="Age Max." value={ageMax} onChange={(e) => setAgeMax(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-light text-gray-700">Région</label>
                </div>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light">
                  <option>Toute la France</option>
                  <option>Île-de-France</option>
                  <option>Auvergne-Rhône-Alpes</option>
                  <option>Provence-Alpes-Côte d'Azur</option>
                  <option>Occitanie</option>
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-light text-gray-700">Département</label>
                </div>
                <input type="text" placeholder="Entrez un département" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserCircle className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-light text-gray-700">Nombre de NRP</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="NRP Min." value={nrpMin} onChange={(e) => setNrpMin(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light" />
                  <input type="text" placeholder="NRP Max." value={nrpMax} onChange={(e) => setNrpMax(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light" />
                </div>
              </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      placeholder="Rechercher par nom"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="w-full px-4 py-2 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">Produit</label>
                    <input
                      type="text"
                      placeholder="Rechercher par produit"
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                      className="w-full px-4 py-2 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">Statut</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="NRP">NRP</option>
                      <option value="Sans statut">Sans statut</option>
                      <option value="À rappeler">À rappeler</option>
                      <option value="RDV pris">RDV pris</option>
                      <option value="Signé">Signé</option>
                    </select>
                  </div>
            </div>

                <div className="p-6 border-t border-gray-200/30 flex gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-5 py-2 bg-white/80 border border-gray-200/50 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </>
          )}

          {viewMode === 'cards' ? (
            <div className="p-4 md:p-6 space-y-4">
            {paginatedLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onUpdate={handleLeadUpdate} showOwner={leadViewMode === 'manager'} />
            ))}
          </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white backdrop-blur-sm border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-light text-gray-600 uppercase tracking-wider">RDV</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Prénom</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Statut</th>
                    {leadViewMode === 'manager' && (
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Propriétaire</th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Ville</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Année</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Imposition</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Résidence</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Code postal</th>
                    {leadViewMode === 'manager' && (
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Statut mis à jour</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedLeadForAppointment(lead);
                            setShowAppointmentModalForLead(true);
                          }}
                          className="inline-flex w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 items-center justify-center transition-all hover:scale-105"
                          title="Ajouter un RDV"
                        >
                          <CalendarDays className="w-4 h-4 text-blue-600" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleCellEdit(lead.id, 'first_name', lead.first_name)}>
                        {editingCell?.leadId === lead.id && editingCell?.field === 'first_name' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="px-2 py-1 bg-white border border-blue-400 rounded text-sm font-light focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-light shadow-md">
                              {lead.first_name[0]}
                            </div>
                            <span className="text-sm font-light text-gray-900">{lead.first_name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleCellEdit(lead.id, 'last_name', lead.last_name)}>
                        {editingCell?.leadId === lead.id && editingCell?.field === 'last_name' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="px-2 py-1 bg-white border border-blue-400 rounded text-sm font-light focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-light text-gray-900">{lead.last_name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleCellEdit(lead.id, 'phone', lead.phone)}>
                        {editingCell?.leadId === lead.id && editingCell?.field === 'phone' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="px-2 py-1 bg-white border border-blue-400 rounded text-sm font-light focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-light text-gray-700">{lead.phone}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleCellEdit(lead.id, 'email', lead.email)}>
                        {editingCell?.leadId === lead.id && editingCell?.field === 'email' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="px-2 py-1 bg-white border border-blue-400 rounded text-sm font-light focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-light text-gray-700">{lead.email}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex flex-col gap-1">
                          <span
                            onClick={() => setShowStatusMenu(showStatusMenu === lead.id ? null : lead.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border cursor-pointer w-fit ${
                              lead.status === 'NRP' ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200/50' :
                              lead.status === 'Sans statut' ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50' :
                              lead.status === 'À rappeler' ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50' :
                              lead.status === 'RDV pris' ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200/50' :
                              lead.status === 'Signé' ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50' :
                              'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50'
                            }`}>
                            {lead.status === 'NRP' && lead.nrp_count && lead.nrp_count > 0 && (
                              <span className="mr-1.5">+{lead.nrp_count}</span>
                            )}
                            {lead.status}
                          </span>
                          {lead.status_updated_at && lead.status_updated_by && (
                            <span className="text-xs text-gray-500 font-light">
                              Mis à jour le {new Date(lead.status_updated_at).toLocaleDateString('fr-FR')} par {lead.status_updated_by}
                            </span>
                          )}
                        </div>
                        {showStatusMenu === lead.id && (
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-10 min-w-max">
                            <button onClick={() => {
                              const updates: Partial<Lead> = { status: 'NRP', nrp_count: (lead.nrp_count || 0) + 1 };
                              handleLeadUpdate(lead.id, updates);
                              setShowStatusMenu(null);
                            }} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-orange-50 text-orange-700">NRP</button>
                            <button onClick={() => { handleLeadUpdate(lead.id, { status: 'Sans statut' }); setShowStatusMenu(null); }} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-gray-50 text-gray-700">Sans statut</button>
                            <button onClick={() => { handleLeadUpdate(lead.id, { status: 'À rappeler' }); setShowStatusMenu(null); }} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-blue-50 text-blue-700">À rappeler</button>
                            <button onClick={() => {
                              handleLeadUpdate(lead.id, { status: 'RDV pris' });
                              setShowStatusMenu(null);
                              setSelectedLeadForAppointment(lead);
                              setShowAppointmentModalForLead(true);
                            }} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-purple-50 text-purple-700">RDV pris</button>
                            <button onClick={() => { handleLeadUpdate(lead.id, { status: 'Signé' }); setShowStatusMenu(null); }} className="block w-full text-left px-3 py-2 text-xs font-light rounded-xl hover:bg-green-50 text-green-700">Signé</button>
                          </div>
                        )}
                      </td>
                      {leadViewMode === 'manager' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-light text-gray-700">{lead.owner || '-'}</span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleCellEdit(lead.id, 'city', lead.city || '')}>
                        {editingCell?.leadId === lead.id && editingCell?.field === 'city' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="px-2 py-1 bg-white border border-blue-400 rounded text-sm font-light focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-light text-gray-700">{lead.city || '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">
                        {lead.postal_code ? lead.postal_code.substring(0, 2) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">{lead.birth_year || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">{lead.imposition || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">{lead.residence_status || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">{lead.postal_code || '-'}</td>
                      {leadViewMode === 'manager' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">
                          {new Date(lead.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-light">
            Affichage de <span className="font-normal">{startIndex + 1}</span> à <span className="font-normal">{Math.min(endIndex, filteredLeads.length)}</span> sur <span className="font-normal">{filteredLeads.length}</span> leads
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full text-sm font-light transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Suivant
            </button>
          </div>
          </div>
        </div>
      </div>
      </div>
      {showAppointmentModalForLead && selectedLeadForAppointment && (
        <AddAppointmentFromLeadModal
          lead={selectedLeadForAppointment}
          onClose={() => {
            setShowAppointmentModalForLead(false);
            setSelectedLeadForAppointment(null);
          }}
        />
      )}
    </div>
  );
}
