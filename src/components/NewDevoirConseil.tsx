import { Search, ArrowLeft, Save, Paperclip, Plus, FileText, Trash2, Download, X, Edit2, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Lead, PredefinedMessage } from '../types';
import { supabase } from '../lib/supabase';
import RecueilExigencesModal from './RecueilExigencesModal';
import AddContractModal from './AddContractModal';
import TableauComparatifModal from './TableauComparatifModal';
import PredefinedMessagesModal from './PredefinedMessagesModal';
import { mockUsers } from '../data/mockUsers';

interface NewDevoirConseilProps {
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
  initialData?: Partial<FormData>;
  conseilId?: string;
}

interface FormData {
  client_name: string;
  civilite: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  site_internet: string;
  actif: boolean;
  adresse: string;
  ville: string;
  code_postal: string;
  date_naissance: string;
  statut_professionnel: string;
  profession: string;
  caisse_professionnelle: string;
  remuneration: string;
  dividende: string;
  credit_en_cours: string;
  autres_revenus: string;
  commentaire: string;
  besoins: string;
  risques: string;
  budget: string;
  situation_familiale: string;
  situation_professionnelle: string;
  projets: string;
  autres_remarques: string;
  produits_proposes: string;
  garanties: string;
  exclusions: string;
  limites: string;
  conditions: string;
  contrat_choisi: string;
  options: string;
  montants_garantie: string;
  adequation_confirmee: boolean;
  risques_refus: string;
  signature_client: string;
  date_signature: string;
  apporteur_affaires: string;
  commentaires_internes: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    organization_id: '1',
    first_name: 'SERGE',
    last_name: 'DEL VALL',
    email: 'delvallepaton.sergie@gmail.com',
    phone: '0620847919',
    status: 'Actif',
    owner: 'Marie Dubois',
    owner_since: '2025-09-15',
    imposition: '+2500€',
    birth_year: 1985,
    postal_code: '31200',
    city: 'TOULOUSE',
    profession: 'Consultant',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

export default function NewDevoirConseil({ onClose, onSubmit, initialData, conseilId }: NewDevoirConseilProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'FAMILLE' | 'BESOINS' | 'FICHES' | 'APPORTEUR' | 'COMMENTAIRE'>('GENERAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecueilModal, setShowRecueilModal] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [editingContractIndex, setEditingContractIndex] = useState<number | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [contractFilter, setContractFilter] = useState('Tous les contrats');
  const [showTableauComparatifModal, setShowTableauComparatifModal] = useState(false);
  const [activePreconisationTab, setActivePreconisationTab] = useState('');
  const [propositions, setPropositions] = useState<string[]>([]);
  const [selectedProposition, setSelectedProposition] = useState('');
  const [propositionDates, setPropositionDates] = useState<{ [key: string]: string }>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureType, setSignatureType] = useState<'immediate' | 'email' | ''>('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [manualAssureurs, setManualAssureurs] = useState<{[key: string]: string[]}>({});
  const [searchManualAssureur, setSearchManualAssureur] = useState('');
  const [showManualAssureurSearch, setShowManualAssureurSearch] = useState(false);
  const [currentContractForAssureur, setCurrentContractForAssureur] = useState<number | null>(null);
  const [savedComment, setSavedComment] = useState<string>('');
  const [isCommentSaved, setIsCommentSaved] = useState(false);
  const [showAffairesNouvellesModal, setShowAffairesNouvellesModal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [contractDescriptions, setContractDescriptions] = useState<{[key: number]: string}>({});
  const [contractJustifications, setContractJustifications] = useState<{[key: number]: string}>({});
  const [showPredefinedMessagesModal, setShowPredefinedMessagesModal] = useState(false);
  const [predefinedMessageMode, setPredefinedMessageMode] = useState<'select' | 'manage'>('select');
  const [predefinedMessageCategory, setPredefinedMessageCategory] = useState<'description' | 'justification' | 'recommendation'>('description');
  const [selectedContractForMessage, setSelectedContractForMessage] = useState<number | null>(null);
  const [messageFieldType, setMessageFieldType] = useState<'description' | 'justification'>('description');

  const PROPOSITION_OPTIONS = [
    'Accord de participation',
    "Accord d'intéressement",
    'Assurance Bris de Machines',
    "Assurance Prud'homme",
    'Assurance Santé Chien Chat',
    "Assurance des Œuvres d'Art et Collections",
    'Assurance habitation colocation',
    'Assurance trottinette électrique & NVEI'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialData?.client_name) {
      setSearchQuery(initialData.client_name);
    }
  }, [initialData]);

  const [formData, setFormData] = useState<FormData>({
    client_name: initialData?.client_name || '',
    civilite: initialData?.civilite || 'M.',
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
    site_internet: initialData?.site_internet || '',
    actif: initialData?.actif || false,
    adresse: initialData?.adresse || '',
    ville: initialData?.ville || '',
    code_postal: initialData?.code_postal || '',
    date_naissance: initialData?.date_naissance || '',
    statut_professionnel: initialData?.statut_professionnel || '',
    profession: initialData?.profession || '',
    caisse_professionnelle: initialData?.caisse_professionnelle || '',
    remuneration: initialData?.remuneration || '',
    dividende: initialData?.dividende || '0',
    credit_en_cours: initialData?.credit_en_cours || '0',
    autres_revenus: initialData?.autres_revenus || '0',
    commentaire: initialData?.commentaire || '',
    besoins: initialData?.besoins || '',
    risques: initialData?.risques || '',
    budget: initialData?.budget || '',
    situation_familiale: initialData?.situation_familiale || '',
    situation_professionnelle: initialData?.situation_professionnelle || '',
    projets: initialData?.projets || '',
    autres_remarques: initialData?.autres_remarques || '',
    produits_proposes: initialData?.produits_proposes || '',
    garanties: initialData?.garanties || '',
    exclusions: initialData?.exclusions || '',
    limites: initialData?.limites || '',
    conditions: initialData?.conditions || '',
    contrat_choisi: initialData?.contrat_choisi || '',
    options: initialData?.options || '',
    montants_garantie: initialData?.montants_garantie || '',
    adequation_confirmee: initialData?.adequation_confirmee || false,
    risques_refus: initialData?.risques_refus || '',
    signature_client: initialData?.signature_client || '',
    date_signature: initialData?.date_signature || '',
    apporteur_affaires: initialData?.apporteur_affaires || '',
    commentaires_internes: initialData?.commentaires_internes || '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadContracts = async () => {
      if (!conseilId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('devoir_conseil_id', conseilId);

      if (error) {
        console.error('Error loading contracts:', error);
      } else if (data) {
        setContracts(data);
      }
    };

    loadContracts();
  }, [conseilId]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const filtered = mockLeads.filter(lead =>
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query)
      );
      setSearchResults(filtered);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(5);

    if (error || !data || data.length === 0) {
      const filtered = mockLeads.filter(lead =>
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(data);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setFormData({
      ...formData,
      client_name: `${lead.first_name} ${lead.last_name}`,
      civilite: 'M.',
      nom: lead.last_name,
      prenom: lead.first_name,
      telephone: lead.phone || '',
      email: lead.email || '',
      ville: lead.city || '',
      code_postal: lead.postal_code || '',
      date_naissance: lead.birth_year ? `${lead.birth_year}-01-01` : '',
      profession: lead.profession || '',
      signature_client: `${lead.first_name} ${lead.last_name}`,
      adresse: lead.residence_status === 'Locataire' ? '1 IMP JACOB INSEL 31200 TOULOUSE' : '',
      remuneration: '34235',
    });
    setSearchQuery(`${lead.first_name} ${lead.last_name}`);
    setShowSearchResults(false);
  };

  const updateFormField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const searchUsers = (query: string) => {
    if (query.length < 1) {
      setUserSearchResults([]);
      return;
    }

    const filtered = mockUsers.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const searchQuery = query.toLowerCase();
      return fullName.includes(searchQuery) || email.includes(searchQuery);
    });

    setUserSearchResults(filtered);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  const handleSelectPredefinedMessage = (message: PredefinedMessage) => {
    if (selectedContractForMessage !== null) {
      if (messageFieldType === 'description') {
        const currentValue = contractDescriptions[selectedContractForMessage] || contracts[selectedContractForMessage]?.gamme_contrat || '';
        const newValue = currentValue ? `${currentValue}\n\n${message.content}` : message.content;
        setContractDescriptions({...contractDescriptions, [selectedContractForMessage]: newValue});
      } else if (messageFieldType === 'justification') {
        const currentValue = contractJustifications[selectedContractForMessage] || '';
        const newValue = currentValue ? `${currentValue}\n\n${message.content}` : message.content;
        setContractJustifications({...contractJustifications, [selectedContractForMessage]: newValue});
      }
    }
    setShowPredefinedMessagesModal(false);
    setSelectedContractForMessage(null);
  };

  const handleValidateSignature = async (type: 'immediate' | 'email') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';

      const devoirData = {
        client_name: `${formData.prenom} ${formData.nom}`,
        besoins: formData.besoins || '',
        risques: formData.risques || '',
        budget: formData.budget || '',
        situation_familiale: formData.situation_familiale || '',
        situation_professionnelle: formData.situation_professionnelle || '',
        projets: formData.projets || '',
        autres_remarques: formData.autres_remarques || '',
        produits_proposes: propositions.join(', '),
        garanties: formData.garanties || '',
        exclusions: formData.exclusions || '',
        limites: formData.limites || '',
        conditions: formData.conditions || '',
        contrat_choisi: contracts.map(c => `${c.gamme_contrat} (${c.assureur})`).join(', '),
        options: '',
        montants_garantie: '',
        adequation_confirmee: false,
        risques_refus: '',
        signature_client: type === 'immediate' ? 'Signé' : 'En attente',
        date_signature: new Date().toISOString().split('T')[0],
        user_id: userId
      };

      const { error } = await supabase
        .from('devoirs_conseil')
        .insert([devoirData]);

      if (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        alert('Erreur lors de l\'enregistrement du devoir de conseil');
        return;
      }

      setShowSignatureModal(false);

      if (type === 'immediate') {
        alert('Devoir de conseil enregistré avec succès !');
      } else {
        alert('Devoir de conseil enregistré et envoyé au client par email !');
      }

      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-light"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>

      {/* Step Indicator */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
            1
          </div>
          <span className="text-base font-light text-gray-700">Informations</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card floating-shadow px-6 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {([{key: 'GENERAL', label: 'Général'}, {key: 'FAMILLE', label: 'Famille'}, {key: 'BESOINS', label: 'Besoins'}, {key: 'FICHES', label: 'Fiches'}, {key: 'APPORTEUR', label: "Apporteur d'affaires"}, {key: 'COMMENTAIRE', label: 'Commentaire'}] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 text-sm font-light transition-all whitespace-nowrap rounded-full ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="glass-card floating-shadow p-8">
          {activeTab === 'GENERAL' && (
            <div className="space-y-6">
              {/* Search Lead */}
              <div className="search-container relative">
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Rechercher un lead
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    placeholder="Rechercher un lead..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 glass-card floating-shadow max-h-60 overflow-y-auto">
                    {searchResults.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{lead.status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* TNS Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-normal text-gray-700">TNS</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => updateFormField('actif', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {/* Main Form Fields - Matching image layout */}
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Civilité
                  </label>
                  <select
                    value={formData.civilite}
                    onChange={(e) => updateFormField('civilite', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
                  >
                    <option>M.</option>
                    <option>Mme.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => updateFormField('nom', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => updateFormField('prenom', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Téléphone du contact
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => updateFormField('telephone', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Email du contact
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Site internet</label>
                  <input
                    type="url"
                    value={formData.site_internet}
                    onChange={(e) => updateFormField('site_internet', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-normal text-gray-700">Actif</span>
                    <input
                      type="checkbox"
                      checked={formData.actif}
                      onChange={(e) => updateFormField('actif', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-normal text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => updateFormField('adresse', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => updateFormField('ville', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Code Postal</label>
                  <input
                    type="text"
                    value={formData.code_postal}
                    onChange={(e) => updateFormField('code_postal', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Date de Naissance</label>
                  <input
                    type="date"
                    value={formData.date_naissance}
                    onChange={(e) => updateFormField('date_naissance', e.target.value)}
                    placeholder="Sélectionner une date"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Statut Professionnel</label>
                  <select
                    value={formData.statut_professionnel}
                    onChange={(e) => updateFormField('statut_professionnel', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
                  >
                    <option value=""></option>
                    <option>Salarié</option>
                    <option>Indépendant</option>
                    <option>Chef d'entreprise</option>
                    <option>Retraité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => updateFormField('profession', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Caisse professionnelle</label>
                  <select
                    value={formData.caisse_professionnelle}
                    onChange={(e) => updateFormField('caisse_professionnelle', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
                  >
                    <option value=""></option>
                    <option>CIPAV</option>
                    <option>CARMF</option>
                    <option>CARPIMKO</option>
                    <option>CAVP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Rémuneration</label>
                  <input
                    type="text"
                    value={formData.remuneration}
                    onChange={(e) => updateFormField('remuneration', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Dividende</label>
                  <input
                    type="text"
                    value={formData.dividende}
                    onChange={(e) => updateFormField('dividende', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Crédit en cours</label>
                  <input
                    type="text"
                    value={formData.credit_en_cours}
                    onChange={(e) => updateFormField('credit_en_cours', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Autres revenus</label>
                  <input
                    type="text"
                    value={formData.autres_revenus}
                    onChange={(e) => updateFormField('autres_revenus', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="glass-card floating-shadow p-6">
                <h3 className="text-base font-normal text-gray-800 mb-4">Pièces jointes</h3>
                <p className="text-xs text-gray-500 font-light mb-4">Format accepté: PDF, JPG (5Mo maximum par fichier)</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="attachments-input"
                    accept=".pdf,.jpg,.jpeg"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const validFiles = files.filter(file => {
                        const isValidType = file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg';
                        const isValidSize = file.size <= 5 * 1024 * 1024;
                        if (!isValidType) {
                          alert(`${file.name}: Format non accepté. Uniquement PDF et JPG.`);
                          return false;
                        }
                        if (!isValidSize) {
                          alert(`${file.name}: Fichier trop volumineux (max 5Mo).`);
                          return false;
                        }
                        return true;
                      });
                      setAttachments([...attachments, ...validFiles]);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="attachments-input"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-light">Cliquez pour ajouter des fichiers</p>
                    <p className="text-xs text-gray-500 font-light mt-1">ou glissez-déposez vos fichiers ici</p>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-normal text-gray-700">Fichiers ajoutés ({attachments.length})</h4>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 flex-1">
                          {file.type === 'application/pdf' ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-light truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 font-light">
                              {(file.size / 1024).toFixed(2)} Ko
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachments(attachments.filter((_, i) => i !== index));
                          }}
                          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Commentaire</label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => updateFormField('commentaire', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-800 dark:text-gray-200 font-normal text-sm mb-2">
                      Recueil des exigences et des besoins pour des opérations d'assurance vie, de retraite ou de capitalisation
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-light text-xs">
                      La partie des exigences et besoins vise à identifier les attentes et les besoins s'agissant de la souscription ou de l'opération envisagée (Reversement, arbitrage, ...)
                    </p>
                  </div>
                  {hasAttachment && (
                    <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full flex-shrink-0">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Pièce jointe</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowRecueilModal(true)}
                    className="px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
                  >
                    Compléter
                  </button>
                </div>
              </div>
            </div>
          )}

          {showRecueilModal && (
            <RecueilExigencesModal
              onClose={() => setShowRecueilModal(false)}
              onSave={(data) => {
                console.log('Recueil data:', data);
                setHasAttachment(true);
                setShowRecueilModal(false);
              }}
              leadData={{
                civilite: formData.civilite,
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                email: formData.email,
                site_internet: formData.site_internet,
                actif: formData.actif,
                adresse: formData.adresse,
                ville: formData.ville,
                code_postal: formData.code_postal,
                date_naissance: formData.date_naissance,
                statut_professionnel: formData.statut_professionnel,
                profession: formData.profession,
                caisse_professionnelle: formData.caisse_professionnelle,
                remuneration: formData.remuneration,
                dividende: formData.dividende,
                credit_en_cours: formData.credit_en_cours,
                autres_revenus: formData.autres_revenus,
                commentaire: formData.commentaire,
                situation_familiale: formData.situation_familiale,
                situation_professionnelle: formData.situation_professionnelle,
                projets: formData.projets
              }}
            />
          )}

          {showAddContractModal && (
            <AddContractModal
              onClose={() => {
                setShowAddContractModal(false);
                setEditingContract(null);
                setEditingContractIndex(null);
              }}
              onSave={(contract) => {
                if (editingContractIndex !== null) {
                  const updatedContracts = [...contracts];
                  updatedContracts[editingContractIndex] = contract;
                  setContracts(updatedContracts);
                } else {
                  setContracts([...contracts, contract]);
                }
                setShowAddContractModal(false);
                setEditingContract(null);
                setEditingContractIndex(null);
              }}
              editContract={editingContract}
              editIndex={editingContractIndex ?? undefined}
            />
          )}

          {activeTab === 'FAMILLE' && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500 font-light">Section Famille - À venir</p>
            </div>
          )}

          {activeTab === 'BESOINS' && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500 font-light">Section Besoins - À venir</p>
            </div>
          )}

          {activeTab === 'FICHES' && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500 font-light">Section Fiches - À venir</p>
            </div>
          )}

          {activeTab === 'APPORTEUR' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Apporteur d'affaires (non visible client)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    placeholder="Rechercher et ajouter un utilisateur..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>

                {userSearchQuery && userSearchResults.length > 0 && !formData.apporteur_affaires && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-light text-gray-900">
                        Résultats de recherche ({userSearchResults.length})
                      </h3>
                    </div>
                    <div className="bg-white/80 border border-gray-200 rounded-2xl max-h-60 overflow-y-auto">
                      <div className="divide-y divide-gray-200">
                        {userSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light">
                                {user.first_name[0]}{user.last_name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-light text-gray-900">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-gray-600 font-light">{user.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const fullName = `${user.first_name} ${user.last_name}`;
                                updateFormField('apporteur_affaires', fullName);
                                setUserSearchQuery('');
                              }}
                              className="px-4 py-1.5 rounded-full text-xs font-light transition-all bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                            >
                              Ajouter
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {formData.apporteur_affaires && (
                  <div className="mt-4">
                    <h3 className="text-sm font-light text-gray-900 mb-3">Apporteur d'affaires sélectionné</h3>
                    <div className="bg-white/80 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-light">
                          {formData.apporteur_affaires.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900">{formData.apporteur_affaires}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateFormField('apporteur_affaires', '');
                          setUserSearchQuery('');
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'COMMENTAIRE' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Commentaires internes (non visible client)
                </label>
                <textarea
                  value={formData.commentaires_internes}
                  onChange={(e) => updateFormField('commentaires_internes', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 resize-none"
                  placeholder="Remarques internes sur ce dossier..."
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isCommentSaved) {
                      setSavedComment(formData.commentaires_internes);
                      setIsCommentSaved(true);
                    } else {
                      if (formData.commentaires_internes.trim()) {
                        setSavedComment(formData.commentaires_internes);
                        setIsCommentSaved(true);
                      }
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-normal hover:bg-blue-600 transition-colors"
                >
                  {isCommentSaved ? 'Modifier' : 'Ajouter'}
                </button>

                {isCommentSaved && savedComment && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Commentaire enregistré :</h4>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{savedComment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Section 2 - Analyse des propositions */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
            2
          </div>
          <span className="text-base font-light text-gray-700">Analyse des propositions</span>
        </div>
      </div>

      {/* Analyse des propositions Content */}
      <div className="glass-card floating-shadow p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <select
              value={selectedProposition}
              onChange={(e) => setSelectedProposition(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Sélectionner une proposition</option>
              {PROPOSITION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (selectedProposition && !propositions.includes(selectedProposition)) {
                setPropositions([...propositions, selectedProposition]);
                setSelectedProposition('');
              }
            }}
            disabled={!selectedProposition}
            className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
          <span className="text-sm font-light text-blue-600">{propositions.length} / 5</span>
        </div>

        <div className="space-y-4">
          {propositions.map((proposition, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-normal text-gray-800">{proposition}</h3>
                <input
                  type="date"
                  value={propositionDates[proposition] || ''}
                  onChange={(e) => setPropositionDates({ ...propositionDates, [proposition]: e.target.value })}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Date d'effet"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTableauComparatifModal(true)}
                  className="px-4 py-1.5 bg-white border border-blue-500 text-blue-600 rounded-full text-xs font-light hover:bg-blue-50 transition-all"
                >
                  Tableau comparatif
                </button>
                <span className="text-sm font-light text-blue-600">0</span>
                <button
                  onClick={() => {
                    const newPropositions = propositions.filter((_, i) => i !== index);
                    setPropositions(newPropositions);
                    if (activePreconisationTab === proposition && newPropositions.length > 0) {
                      setActivePreconisationTab(newPropositions[0]);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 - Les Contrats */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
            3
          </div>
          <span className="text-base font-light text-gray-700">Les contrats</span>
        </div>
      </div>

      {/* Les Contrats Content */}
      <div className="glass-card floating-shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1"></div>
          <select
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option>Tous les contrats</option>
            <option>Assurance vie</option>
            <option>PER</option>
            <option>Capitalisation</option>
            <option>Prévoyance</option>
          </select>
        </div>

        {/* Table header */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <div className="grid grid-cols-4 gap-6 px-4 py-3">
            <div className="text-xs font-light text-gray-600 uppercase">PORTEFEUILLE</div>
            <div className="text-xs font-light text-gray-600 uppercase">GAMME</div>
            <div className="text-xs font-light text-gray-600 uppercase">ASSUREUR</div>
            <div className="text-xs font-light text-gray-600 uppercase">ACTIONS</div>
          </div>
        </div>

        {/* Empty state or contracts list */}
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm font-light mb-6">Aucun élément n'a été trouvé</p>
            <button
              onClick={() => setShowAddContractModal(true)}
              className="px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un nouveau contrat
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {contracts.map((contract, index) => (
              <div key={index} className="grid grid-cols-4 gap-6 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                <div className="text-sm font-light text-gray-700">{contract.en_portefeuille ? 'Oui' : 'Non'}</div>
                <div className="text-sm font-light text-gray-700">{contract.gamme_contrat}</div>
                <div className="text-sm font-light text-gray-700">{contract.assureur}</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingContract(contract);
                      setEditingContractIndex(index);
                      setShowAddContractModal(true);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setContracts(contracts.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowAddContractModal(true)}
              className="w-full px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-4 h-4" />
              Ajouter un nouveau contrat
            </button>
          </div>
        )}
      </div>

      {/* Section 4 - Préconisation et conseils */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
              4
            </div>
            <span className="text-base font-light text-gray-700">Préconisation et conseils</span>
          </div>
          <button
            onClick={() => {
              setPredefinedMessageMode('manage');
              setShowPredefinedMessagesModal(true);
            }}
            className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Gérer les messages
          </button>
        </div>
      </div>

      {/* Préconisation et conseils Content */}
      <div className="glass-card floating-shadow p-8">
        {contracts.length > 0 ? (
          <div className="space-y-8">
            {contracts.map((contract, index) => (
              <div key={index} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 pb-2 border-b border-gray-200">
                  {contract.gamme_contrat}
                </h3>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-normal text-gray-700">Description</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContractForMessage(index);
                        setMessageFieldType('description');
                        setPredefinedMessageCategory('description');
                        setPredefinedMessageMode('select');
                        setShowPredefinedMessagesModal(true);
                      }}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-light hover:bg-blue-100 transition-all flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Insérer un message
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={contractDescriptions[index] || contract.gamme_contrat}
                    onChange={(e) => setContractDescriptions({...contractDescriptions, [index]: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    placeholder={`Description pour ${contract.gamme_contrat}`}
                  />
                </div>

                {/* Justification */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-normal text-gray-700">Justification</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContractForMessage(index);
                        setMessageFieldType('justification');
                        setPredefinedMessageCategory('justification');
                        setPredefinedMessageMode('select');
                        setShowPredefinedMessagesModal(true);
                      }}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-light hover:bg-blue-100 transition-all flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Insérer un message
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={contractJustifications[index] || ''}
                    onChange={(e) => setContractJustifications({...contractJustifications, [index]: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    placeholder="Justification du choix"
                  />
                </div>

                {/* Assureurs interrogés */}
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Assureurs interrogés</label>
                  <div className="p-4 bg-white rounded-lg border border-gray-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {contract.assureurs_interroges && contract.assureurs_interroges.length > 0 ? (
                        contract.assureurs_interroges.map((assureur: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light"
                          >
                            {assureur}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light">
                          {contract.assureur}
                        </span>
                      )}
                      {manualAssureurs[index]?.map((assureur, idx) => (
                        <span
                          key={`manual-${idx}`}
                          className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light flex items-center gap-1"
                        >
                          {assureur}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = {...manualAssureurs};
                              updated[index] = updated[index].filter((_, i) => i !== idx);
                              setManualAssureurs(updated);
                            }}
                            className="text-gray-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={currentContractForAssureur === index ? searchManualAssureur : ''}
                          onChange={(e) => {
                            setSearchManualAssureur(e.target.value);
                            setCurrentContractForAssureur(index);
                            setShowManualAssureurSearch(true);
                          }}
                          onFocus={() => {
                            setCurrentContractForAssureur(index);
                            setShowManualAssureurSearch(true);
                          }}
                          placeholder="Ajouter un autre assureur..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        {showManualAssureurSearch && currentContractForAssureur === index && searchManualAssureur && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-20">
                            {['Allianz', 'AXA', 'Generali', 'Swiss Life', 'Suravenir', 'April', 'Malakoff Humanis', 'Groupama'].filter(a =>
                              a.toLowerCase().includes(searchManualAssureur.toLowerCase())
                            ).map((assureur) => (
                              <button
                                key={assureur}
                                type="button"
                                onClick={() => {
                                  const updated = {...manualAssureurs};
                                  if (!updated[index]) updated[index] = [];
                                  if (!updated[index].includes(assureur)) {
                                    updated[index].push(assureur);
                                  }
                                  setManualAssureurs(updated);
                                  setSearchManualAssureur('');
                                  setShowManualAssureurSearch(false);
                                }}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                              >
                                {assureur}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (searchManualAssureur && currentContractForAssureur === index) {
                            const updated = {...manualAssureurs};
                            if (!updated[index]) updated[index] = [];
                            if (!updated[index].includes(searchManualAssureur)) {
                              updated[index].push(searchManualAssureur);
                            }
                            setManualAssureurs(updated);
                            setSearchManualAssureur('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-all"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 font-light text-sm py-8">Ajoutez des contrats dans la section 2 pour les configurer ici</p>
        )}

        <p className="text-xs text-gray-600 font-light mt-6 text-center">
          Nous tenons à votre disposition les devis des autres assureurs même si nous estimons que cela ne correspond pas à votre besoin.
        </p>
      </div>

      {/* Section 5 - Les documents connaissance client */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
            5
          </div>
          <span className="text-base font-light text-gray-700">Les documents connaissance client</span>
        </div>
      </div>

      {/* Documents connaissance client Content */}
      <div className="glass-card floating-shadow p-8">
        <p className="text-sm font-light text-gray-600 mb-6">Format : JPEG, PNG, PDF - Poids : 5Mo maximum</p>

        <div className="space-y-6">
          <div className="flex items-start justify-between py-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-sm font-normal text-gray-800 mb-1">Pièce d'identité</h3>
              <p className="text-xs text-gray-500 font-light">CNI recto verso ou page avec la photo sur le passeport.</p>
            </div>
            <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>

          <div className="flex items-start justify-between py-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-sm font-normal text-gray-800 mb-1">RIB</h3>
              <p className="text-xs text-gray-500 font-light">Le Relevé d'identité bancaire (RIB).</p>
            </div>
            <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>

          <div className="flex items-start justify-between py-4 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-sm font-normal text-gray-800 mb-1">Justificatif de domicile</h3>
              <p className="text-xs text-gray-500 font-light">Facture (électricité...) datant de moins d'un an à votre nom.</p>
            </div>
            <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>

          <div className="flex items-start justify-between py-4">
            <div className="flex-1">
              <h3 className="text-sm font-normal text-gray-800 mb-1">Autres</h3>
              <p className="text-xs text-gray-500 font-light">Autres type de documents</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-light text-blue-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6 - Signatures */}
      <div className="glass-card floating-shadow px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-light shadow-md">
            6
          </div>
          <span className="text-base font-light text-gray-700">Signatures</span>
        </div>
      </div>

      {/* Signatures Content */}
      <div className="glass-card floating-shadow p-8">
        <h3 className="text-center text-base font-normal text-gray-800 mb-6">Texte de signature électronique</h3>

        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200/50">
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
            <p>
              Je soussigné(e) <span className="font-medium text-blue-600">{formData.prenom} {formData.nom}</span>,
              né(e) le <span className="font-medium text-blue-600">{formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : '___________'}</span>,
              demeurant à <span className="font-medium text-blue-600">{formData.adresse || '___________'}</span>,
              <span className="font-medium text-blue-600"> {formData.code_postal} {formData.ville}</span>.
            </p>
            <p>
              Profession: <span className="font-medium text-blue-600">{formData.profession || '___________'}</span>
            </p>
            <p>
              Téléphone: <span className="font-medium text-blue-600">{formData.telephone || '___________'}</span>
            </p>
            <p>
              Email: <span className="font-medium text-blue-600">{formData.email || '___________'}</span>
            </p>
            <p className="mt-4">
              Certifie avoir pris connaissance de l'ensemble des éléments du présent devoir de conseil,
              notamment les informations relatives à mes besoins et exigences, l'analyse de ma situation,
              les propositions qui m'ont été faites ainsi que les raisons qui motivent le conseil fourni.
            </p>
            <p className="mt-4">
              Accepte expressément que les contrats suivants soient souscrits:
            </p>
            {contracts.length > 0 && (
              <div className="ml-4 space-y-3">
                {contracts.map((contract, index) => {
                  const financialDetails = [];
                  if (contract.montant_initial) financialDetails.push(`Montant initial: ${contract.montant_initial}`);
                  if (contract.versement_programme) financialDetails.push(`Versement programmé: ${contract.versement_programme}`);
                  if (contract.versement_initial) financialDetails.push(`Versement initial: ${contract.versement_initial}`);
                  if (contract.periodicite) financialDetails.push(`Périodicité: ${contract.periodicite}`);
                  if (contract.vp_optionnel) financialDetails.push(`VP optionnel: ${contract.vp_optionnel}`);
                  if (contract.vl) financialDetails.push(`VL: ${contract.vl}`);
                  if (contract.frais_versement) financialDetails.push(`Frais de versement: ${contract.frais_versement}%`);
                  if (contract.frais_chacun) financialDetails.push(`Frais: ${contract.frais_chacun}%`);
                  if (contract.frais_a_definir) financialDetails.push(`Frais à définir: ${contract.frais_a_definir}`);
                  if (contract.frais_dossier) financialDetails.push(`Frais de dossier: ${contract.frais_dossier}`);
                  if (contract.frais_transfert) financialDetails.push(`Frais de transfert: ${contract.frais_transfert}`);
                  if (contract.montant_transfert) financialDetails.push(`Montant transfert: ${contract.montant_transfert}`);
                  if (contract.numero_contrat) financialDetails.push(`N° contrat: ${contract.numero_contrat}`);
                  if (contract.date_effet) financialDetails.push(`Date d'effet: ${new Date(contract.date_effet).toLocaleDateString('fr-FR')}`);
                  if (contract.date_souscription) financialDetails.push(`Date de souscription: ${new Date(contract.date_souscription).toLocaleDateString('fr-FR')}`);
                  if (contract.loi_madelin) financialDetails.push('Loi Madelin');
                  if (contract.mma_elite) financialDetails.push('MMA Elite');

                  return (
                    <div key={index} className="border-l-2 border-blue-300 pl-4 py-1">
                      <p>
                        <span className="font-medium text-blue-600">
                          {contract.produit || contract.gamme_contrat}
                        </span>{' '}
                        auprès de{' '}
                        <span className="font-medium text-blue-600">{contract.assureur}</span>
                      </p>
                      {financialDetails.length > 0 && (
                        <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                          {financialDetails.map((detail, idx) => (
                            <li key={idx} className="ml-4">• {detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-4">
              Fait à <span className="font-medium text-blue-600">{formData.ville || '___________'}</span>,
              le <span className="font-medium text-blue-600">{new Date().toLocaleDateString('fr-FR')}</span>
            </p>
            <p className="mt-6 text-xs text-gray-500 italic">
              Signature précédée de la mention "Lu et approuvé"
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-light text-gray-700">Afficher uniquement les contrats de la gamme préconisée</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSignatureType('immediate');
                setShowSignatureModal(true);
              }}
              className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
            >
              Signature immédiate
            </button>
            <button
              onClick={() => {
                setSignatureType('email');
                setShowSignatureModal(true);
              }}
              className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
            >
              Signature par email
            </button>
            <button
              onClick={() => setShowAffairesNouvellesModal(true)}
              className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
            >
              Envoyer en affaires nouvelles
            </button>
          </div>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
          >
            Prévisualiser
          </button>
        </div>
      </div>

      {showTableauComparatifModal && (
        <TableauComparatifModal onClose={() => setShowTableauComparatifModal(false)} />
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={() => setShowSignatureModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {signatureType === 'immediate' ? 'Joindre le suivi de dossier papier' : 'Joindre l\'enregistrement'}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {signatureType === 'immediate'
                  ? 'Veuillez joindre le suivi de dossier papier pour finaliser la signature immédiate.'
                  : 'Vous pouvez joindre l\'enregistrement (non obligatoire).'}
              </p>
              <div className="mb-6">
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Document {signatureType === 'email' && '(optionnel)'}
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-light hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleSubmit();
                    setShowSignatureModal(false);
                  }}
                  className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
                >
                  Valider plus tard
                </button>
                <button
                  onClick={() => handleValidateSignature(signatureType as 'immediate' | 'email')}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Affaires Nouvelles Modal */}
      {showAffairesNouvellesModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={() => setShowAffairesNouvellesModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Envoyer en affaires nouvelles
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir envoyer ce devoir de conseil en affaires nouvelles ? Cette action marquera le dossier comme étant traité.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAffairesNouvellesModal(false)}
                  className="flex-1 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-light hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (conseilId) {
                        const { error } = await supabase
                          .from('devoirs_conseil')
                          .update({
                            affaires_nouvelles_status: 'sent',
                            affaires_nouvelles_sent_at: new Date().toISOString()
                          })
                          .eq('id', conseilId);

                        if (error) throw error;
                      }

                      setShowAffairesNouvellesModal(false);
                      setSuccessMessage('Le devoir de conseil a été envoyé en affaires nouvelles avec succès !');
                      setShowSuccessMessage(true);
                      setTimeout(() => {
                        setShowSuccessMessage(false);
                      }, 3000);
                    } catch (error) {
                      console.error('Error sending to affaires nouvelles:', error);
                      alert('Erreur lors de l\'envoi en affaires nouvelles');
                    }
                  }}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={() => setShowPreviewModal(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl my-4 flex flex-col border border-gray-200/50 pointer-events-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200/30 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-light text-gray-900">Prévisualisation - Devoir de Conseil</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Section 1 - Informations */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">1. Informations</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Civilité:</span> {formData.civilite || '-'}</div>
                      <div><span className="font-medium">Nom:</span> {formData.nom || '-'}</div>
                      <div><span className="font-medium">Prénom:</span> {formData.prenom || '-'}</div>
                      <div><span className="font-medium">Téléphone:</span> {formData.telephone || '-'}</div>
                      <div><span className="font-medium">Email:</span> {formData.email || '-'}</div>
                      <div><span className="font-medium">Site internet:</span> {formData.site_internet || '-'}</div>
                      <div><span className="font-medium">TNS:</span> {formData.actif ? 'Oui' : 'Non'}</div>
                      <div><span className="font-medium">Adresse:</span> {formData.adresse || '-'}</div>
                      <div><span className="font-medium">Ville:</span> {formData.ville || '-'}</div>
                      <div><span className="font-medium">Code postal:</span> {formData.code_postal || '-'}</div>
                      <div><span className="font-medium">Date de naissance:</span> {formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : '-'}</div>
                      <div><span className="font-medium">Statut professionnel:</span> {formData.statut_professionnel || '-'}</div>
                      <div><span className="font-medium">Profession:</span> {formData.profession || '-'}</div>
                      <div><span className="font-medium">Caisse professionnelle:</span> {formData.caisse_professionnelle || '-'}</div>
                      <div><span className="font-medium">Rémunération:</span> {formData.remuneration || '-'}</div>
                      <div><span className="font-medium">Dividende:</span> {formData.dividende || '-'}</div>
                      <div><span className="font-medium">Crédit en cours:</span> {formData.credit_en_cours || '-'}</div>
                      <div><span className="font-medium">Autres revenus:</span> {formData.autres_revenus || '-'}</div>
                      <div><span className="font-medium">Situation familiale:</span> {formData.situation_familiale || '-'}</div>
                      <div><span className="font-medium">Situation professionnelle:</span> {formData.situation_professionnelle || '-'}</div>
                      <div className="col-span-2"><span className="font-medium">Projets:</span> {formData.projets || '-'}</div>
                      {formData.commentaire && (
                        <div className="col-span-2">
                          <span className="font-medium">Commentaire:</span>
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">{formData.commentaire}</div>
                        </div>
                      )}
                      {formData.apporteur_affaires && (
                        <div className="col-span-2"><span className="font-medium">Apporteur d'affaires:</span> {formData.apporteur_affaires}</div>
                      )}
                      {formData.commentaires_internes && (
                        <div className="col-span-2">
                          <span className="font-medium">Commentaires internes:</span>
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">{formData.commentaires_internes}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2 - Analyse des propositions */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">2. Analyse des propositions</h3>
                    {propositions.map((prop, index) => (
                      <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{prop}</span>
                        {propositionDates[prop] && (
                          <span className="text-sm text-gray-600 ml-2">
                            - Date d'effet: {new Date(propositionDates[prop]).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Section 3 - Les Contrats */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">3. Les Contrats</h3>
                    {contracts.map((contract, index) => (
                      <div key={index} className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <div className="font-medium text-gray-900">{contract.gamme_contrat}</div>
                        <div className="text-sm text-gray-600">Assureur: {contract.assureur}</div>
                      </div>
                    ))}
                  </div>

                  {/* Section 4 - Préconisation */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">4. Préconisation et conseils</h3>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">Assureurs interrogés</h4>
                      {contracts.map((contract, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium text-sm mb-2">{contract.gamme_contrat}</div>
                          <div className="flex flex-wrap gap-2">
                            {contract.assureurs_interroges?.map((assureur: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {assureur}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6 - Signature */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Texte de signature électronique</h3>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                      <p>
                        Je soussigné(e) <span className="font-medium text-blue-600">{formData.prenom} {formData.nom}</span>,
                        né(e) le <span className="font-medium text-blue-600">{formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : '___________'}</span>,
                        demeurant à <span className="font-medium text-blue-600">{formData.adresse || '___________'}</span>,
                        <span className="font-medium text-blue-600"> {formData.code_postal} {formData.ville}</span>.
                      </p>
                      <p>
                        Profession: <span className="font-medium text-blue-600">{formData.profession || '___________'}</span>
                      </p>
                      <p>
                        Téléphone: <span className="font-medium text-blue-600">{formData.telephone || '___________'}</span>
                      </p>
                      <p>
                        Email: <span className="font-medium text-blue-600">{formData.email || '___________'}</span>
                      </p>
                      <p className="mt-4">
                        Certifie avoir pris connaissance de l'ensemble des éléments du présent devoir de conseil,
                        notamment les informations relatives à mes besoins et exigences, l'analyse de ma situation,
                        les propositions qui m'ont été faites ainsi que les raisons qui motivent le conseil fourni.
                      </p>
                      <p className="mt-4">
                        Accepte expressément que les contrats suivants soient souscrits:
                      </p>
                      {contracts.length > 0 && (
                        <div className="ml-4 space-y-3">
                          {contracts.map((contract, index) => {
                            const financialDetails = [];
                            if (contract.montant_initial) financialDetails.push(`Montant initial: ${contract.montant_initial}`);
                            if (contract.versement_programme) financialDetails.push(`Versement programmé: ${contract.versement_programme}`);
                            if (contract.versement_initial) financialDetails.push(`Versement initial: ${contract.versement_initial}`);
                            if (contract.periodicite) financialDetails.push(`Périodicité: ${contract.periodicite}`);
                            if (contract.vp_optionnel) financialDetails.push(`VP optionnel: ${contract.vp_optionnel}`);
                            if (contract.vl) financialDetails.push(`VL: ${contract.vl}`);
                            if (contract.frais_versement) financialDetails.push(`Frais de versement: ${contract.frais_versement}%`);
                            if (contract.frais_chacun) financialDetails.push(`Frais: ${contract.frais_chacun}%`);
                            if (contract.frais_a_definir) financialDetails.push(`Frais à définir: ${contract.frais_a_definir}`);
                            if (contract.frais_dossier) financialDetails.push(`Frais de dossier: ${contract.frais_dossier}`);
                            if (contract.frais_transfert) financialDetails.push(`Frais de transfert: ${contract.frais_transfert}`);
                            if (contract.montant_transfert) financialDetails.push(`Montant transfert: ${contract.montant_transfert}`);
                            if (contract.numero_contrat) financialDetails.push(`N° contrat: ${contract.numero_contrat}`);
                            if (contract.date_effet) financialDetails.push(`Date d'effet: ${new Date(contract.date_effet).toLocaleDateString('fr-FR')}`);
                            if (contract.date_souscription) financialDetails.push(`Date de souscription: ${new Date(contract.date_souscription).toLocaleDateString('fr-FR')}`);
                            if (contract.loi_madelin) financialDetails.push('Loi Madelin');
                            if (contract.mma_elite) financialDetails.push('MMA Elite');

                            return (
                              <div key={index} className="border-l-2 border-blue-300 pl-4 py-1">
                                <p>
                                  <span className="font-medium text-blue-600">
                                    {contract.produit || contract.gamme_contrat}
                                  </span>{' '}
                                  auprès de{' '}
                                  <span className="font-medium text-blue-600">{contract.assureur}</span>
                                </p>
                                {financialDetails.length > 0 && (
                                  <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                                    {financialDetails.map((detail, idx) => (
                                      <li key={idx} className="ml-4">• {detail}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <p className="mt-4">
                        Fait à <span className="font-medium text-blue-600">{formData.ville || '___________'}</span>,
                        le <span className="font-medium text-blue-600">{new Date().toLocaleDateString('fr-FR')}</span>
                      </p>
                      <p className="mt-6 text-xs text-gray-500 italic">
                        Signature précédée de la mention "Lu et approuvé"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Predefined Messages Modal */}
      {showPredefinedMessagesModal && (
        <PredefinedMessagesModal
          onClose={() => {
            setShowPredefinedMessagesModal(false);
            setSelectedContractForMessage(null);
          }}
          onSelectMessage={handleSelectPredefinedMessage}
          mode={predefinedMessageMode}
          category={predefinedMessageCategory}
        />
      )}
    </div>
  );
}
