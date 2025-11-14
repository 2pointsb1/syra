import { Bell, Search, Send, Upload, FileText, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getOrganizationSettings } from '../services/organizationSettingsService';
import { getActiveProfile, getProfilePermissions, UserProfile } from '../services/profileService';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const mockLeads: Lead[] = [
  { id: '1', first_name: 'Madame', last_name: 'DAHCHAR', email: 'dahchar@icloud.com', phone: '0781170861' },
  { id: '2', first_name: 'Monsieur', last_name: 'DUPART', email: 'dupart33@gmail.com', phone: '0688523264' },
  { id: '3', first_name: 'Yannick', last_name: 'GOASDOUE', email: 'nikenyan0@gmail.com', phone: '0687180650' },
];

const defaultEmailContent = `Bienvenue chez BIENVIYANCE, votre partenaire de confiance en matière de courtage en assurance et de family office dédié à votre protection sociale et votre épargne.
Chez Bienviyance , notre mission première est de placer votre bien-être financier et celui de votre famille au cœur de nos préoccupations.

Nous comprenons que chaque individu a des besoins uniques en matière d'assurance et d'épargne, c'est pourquoi nous mettons en œuvre notre expertise pointue pour vous offrir des solutions sur mesure, parfaitement adaptées à votre situation.

Que ce soit pour assurer l'avenir de vos proches, préparer votre retraite en toute sérénité, ou encore optimiser votre patrimoine, nous mettons à votre disposition une gamme complète de produits et de stratégies personnalisées.

Avec nous, vous bénéficierez de conseils éclairés, d'une analyse approfondie de vos besoins et de solutions innovantes pour protéger ce qui compte le plus pour vous.


Nous nous efforçons de vous offrir la meilleure couverture au meilleur prix, tout en vous donnant les clés pour faire fructifier votre épargne et sécuriser votre avenir financier.

Faites le choix de la Bienviyance envers votre patrimoine et votre famille.`;

interface MiseEnRelationProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function MiseEnRelation({ onNotificationClick, notificationCount }: MiseEnRelationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [emailContent, setEmailContent] = useState(defaultEmailContent);
  const [advisorPdf, setAdvisorPdf] = useState<string>('Moche Azran BNVCE.pdf');
  const [plaquettePdf, setPlaquettePdf] = useState<string>('Plaquette BNVCE.pdf');
  const [additionalPdf, setAdditionalPdf] = useState<string | null>(null);
  const advisorFileInputRef = useRef<HTMLInputElement>(null);
  const plaquetteFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [canEditTemplates, setCanEditTemplates] = useState(false);

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getActiveProfile();
      setCurrentProfile(profile);
      if (profile) {
        const permissions = getProfilePermissions(profile.profile_type);
        setCanEditTemplates(permissions.canEditEmailTemplates);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setCanEditTemplates(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await getOrganizationSettings();
      if (settings) {
        if (settings.email_template_content) {
          setEmailContent(settings.email_template_content);
        }
        if (settings.email_first_attachment_url) {
          setAdvisorPdf(settings.email_first_attachment_url);
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const filteredLeads = mockLeads.filter(lead => {
    const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setSearchQuery(`${lead.first_name} ${lead.last_name}`);
    setShowLeadDropdown(false);
  };

  const handleSendEmail = () => {
    if (!selectedLead) {
      alert('Veuillez sélectionner un lead');
      return;
    }
    console.log('Envoi de la mise en relation à:', selectedLead.email);
    console.log('Contenu:', emailContent);
    console.log('PDFs joints:', ['Plaquette BNVCE.pdf', advisorPdf]);
    alert(`Mise en relation envoyée à ${selectedLead.first_name} ${selectedLead.last_name}`);
  };

  const handleAdvisorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAdvisorPdf(file.name);
    } else {
      alert('Veuillez sélectionner un fichier PDF');
    }
  };

  const handlePlaquetteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPlaquettePdf(file.name);
    } else {
      alert('Veuillez sélectionner un fichier PDF');
    }
  };

  const handleAdditionalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAdditionalPdf(file.name);
    } else {
      alert('Veuillez sélectionner un fichier PDF');
    }
  };

  const removeAdditionalFile = () => {
    setAdditionalPdf(null);
    if (additionalFileInputRef.current) {
      additionalFileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Mise en relation</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Envoyez des mises en relation personnalisées à vos leads</p>
        </div>
        <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0">
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div className="glass-card p-6 md:p-8 floating-shadow">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un lead
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowLeadDropdown(true);
                      if (!e.target.value) setSelectedLead(null);
                    }}
                    onFocus={() => setShowLeadDropdown(true)}
                    placeholder="Rechercher un lead..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                {showLeadDropdown && searchQuery && filteredLeads.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {filteredLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => handleLeadSelect(lead)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <div className="font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{lead.email} • {lead.phone}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedLead && (
                <div className="mt-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedLead.first_name} {selectedLead.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{selectedLead.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLead(null);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-white rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Contenu du mail
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                disabled={!canEditTemplates}
                className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs ${
                  canEditTemplates ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">
                Pièces jointes
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Plaquette Bienviyance</p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{plaquettePdf}</p>
                      {canEditTemplates && (
                        <>
                          <button
                            onClick={() => plaquetteFileInputRef.current?.click()}
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Modifier le fichier
                          </button>
                          <input
                            ref={plaquetteFileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={handlePlaquetteFileChange}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Moche Azran</p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{advisorPdf}</p>
                      <button
                        onClick={() => advisorFileInputRef.current?.click()}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Modifier le fichier
                      </button>
                      <input
                        ref={advisorFileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleAdvisorFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {additionalPdf ? (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3 border border-green-200">
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Pièce jointe supplémentaire</p>
                        <p className="text-xs text-gray-600 mt-0.5 truncate">{additionalPdf}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => additionalFileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Modifier
                          </button>
                          <button
                            onClick={removeAdditionalFile}
                            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            <X className="w-3.5 h-3.5" />
                            Supprimer
                          </button>
                        </div>
                        <input
                          ref={additionalFileInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={handleAdditionalFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => additionalFileInputRef.current?.click()}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 border border-dashed border-gray-300 hover:border-gray-400 transition-all hover:from-gray-100 hover:to-gray-200"
                  >
                    <div className="flex items-center justify-center gap-2 h-full">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">Ajouter une pièce jointe</p>
                        <p className="text-xs text-gray-500">Fichier PDF uniquement</p>
                      </div>
                    </div>
                    <input
                      ref={additionalFileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleAdditionalFileChange}
                      className="hidden"
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <button
                onClick={handleSendEmail}
                disabled={!selectedLead}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Envoyer mise en relation
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
