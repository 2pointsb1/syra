import { X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { INSURANCE_COMPANIES, getCompanyByName, getProductByName, getAllCompanyNames, ProductConfig } from '../data/insuranceProducts';
import { getContractCategory, shouldShowPERExistantField, shouldShowAssuranceVieExistanteField, shouldShowMutuelleReminder, shouldShowPrevoyanceRenouvellementField, shouldShowAssuranceEmprunteurReminder } from '../utils/contractCategories';
import { createAutomaticReminder } from '../services/automaticRemindersService';

interface AddContractModalProps {
  onClose: () => void;
  onSave?: (contract: ContractData) => void;
  editContract?: ContractData;
  editIndex?: number;
}

interface ContractData {
  assureur: string;
  gamme_contrat: string;
  produit: string;
  remuneration_type: string;
  en_portefeuille: boolean;
  loi_madelin: boolean;
  contrat_principal: boolean;
  numero_contrat: string;
  delegataire_gestion: string;
  commentaires: string;
  date_souscription: string;
  date_effet: string;
  date_echeance: string;
  date_effet_supplementaire: string;
  montant_initial: string;
  versement_programme: string;
  versement_initial: string;
  periodicite: string;
  vl: string;
  frais_versement: string;
  vp_optionnel: string;
  frais_a_definir: string;
  frais_chacun: string;
  mma_elite: boolean;
  transfert: boolean;
  montant_transfert: string;
  frais_transfert: string;
  frais_dossier: string;
  assureurs_interroges: string[];
  propositions_comparatives: string[];
  per_existant?: boolean;
  assurance_vie_existante?: boolean;
  rachat_effectue?: boolean;
  contrat_renouvellement_remplacement?: 'nouveau' | 'renouvellement' | 'remplacement' | '';
}

const ASSUREURS = getAllCompanyNames();

const GAMMES = [
  'Assurance vie',
  'PER',
  'Capitalisation',
  'Prévoyance',
  'Santé',
  'IARD',
  'Assurance emprunteur',
];

const ASSUREURS_SUGGESTIONS: { [key: string]: string[] } = {
  'Assurance vie': ['Suravenir', 'Swiss Life', 'Generali'],
  'PER': ['Suravenir', 'Swiss Life', 'AG2R La Mondiale'],
  'Capitalisation': ['Suravenir', 'Generali', 'AXA'],
  'Prévoyance': ['Swiss Life', 'Generali', 'Malakoff Humanis'],
  'Santé': ['Allianz', 'April', 'Malakoff Humanis'],
  'IARD': ['Allianz', 'AXA', 'Groupama'],
  'Assurance emprunteur': ['Suravenir', 'Generali', 'AXA'],
};

export default function AddContractModal({ onClose, onSave, editContract, editIndex }: AddContractModalProps) {
  const [searchAssureur, setSearchAssureur] = useState('');
  const [assureursInterroges, setAssureursInterroges] = useState<string[]>(editContract?.assureurs_interroges || []);
  const [availableProducts, setAvailableProducts] = useState<ProductConfig[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductConfig | null>(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [showReminderSuccess, setShowReminderSuccess] = useState(false);
  const [formData, setFormData] = useState<ContractData>(editContract || {
    assureur: '',
    gamme_contrat: '',
    produit: '',
    remuneration_type: '',
    en_portefeuille: false,
    loi_madelin: false,
    contrat_principal: false,
    numero_contrat: '',
    delegataire_gestion: '',
    commentaires: '',
    date_souscription: '',
    date_effet: '',
    date_echeance: '',
    date_effet_supplementaire: '',
    montant_initial: '',
    versement_programme: '',
    versement_initial: '',
    periodicite: '',
    vl: '',
    frais_versement: '',
    vp_optionnel: '',
    frais_a_definir: '',
    frais_chacun: '',
    mma_elite: false,
    transfert: false,
    montant_transfert: '',
    frais_transfert: '',
    frais_dossier: '',
    assureurs_interroges: [],
    propositions_comparatives: [],
    per_existant: false,
    assurance_vie_existante: false,
    rachat_effectue: false,
    contrat_renouvellement_remplacement: '',
  });

  const filteredAssureurs = ASSUREURS.filter(assureur =>
    assureur.toLowerCase().includes(searchAssureur.toLowerCase())
  );

  const handleGammeChange = (gamme: string) => {
    setFormData({ ...formData, gamme_contrat: gamme });

    if (formData.assureur && gamme && ASSUREURS_SUGGESTIONS[gamme]) {
      const suggestions = ASSUREURS_SUGGESTIONS[gamme];
      const otherSuggestions = suggestions.filter(s => s !== formData.assureur).slice(0, 2);
      setAssureursInterroges([formData.assureur, ...otherSuggestions]);
    }
  };

  const handleAssureurChange = (assureur: string) => {
    setFormData({ ...formData, assureur, produit: '', remuneration_type: '', propositions_comparatives: [] });
    setSelectedProduct(null);

    const company = getCompanyByName(assureur);
    if (company) {
      setAvailableProducts(company.products);
    } else {
      setAvailableProducts([]);
    }
  };

  const handleProductChange = (productName: string) => {
    const product = getProductByName(formData.assureur, productName);
    if (product) {
      setSelectedProduct(product);

      // Set assureurs interroges based on comparative proposals
      const interrogatedInsurers = [formData.assureur, ...product.comparativeProposals].slice(0, 4);
      setAssureursInterroges(interrogatedInsurers);

      setFormData({
        ...formData,
        produit: productName,
        remuneration_type: product.remuneration,
        propositions_comparatives: product.comparativeProposals,
      });
    }
  };

  useEffect(() => {
    if (editContract && editContract.assureur) {
      const company = getCompanyByName(editContract.assureur);
      if (company) {
        setAvailableProducts(company.products);
        if (editContract.produit) {
          const product = getProductByName(editContract.assureur, editContract.produit);
          if (product) {
            setSelectedProduct(product);
          }
        }
      }
    }
  }, [editContract]);

  const handleSave = async () => {
    if (onSave) {
      const dataToSave = {
        ...formData,
        assureurs_interroges: assureursInterroges,
      };
      onSave(dataToSave);

      try {
        const result = await createAutomaticReminder(
          {
            produit: formData.produit,
            per_existant: formData.per_existant,
            assurance_vie_existante: formData.assurance_vie_existante,
            rachat_effectue: formData.rachat_effectue,
            contrat_renouvellement_remplacement: formData.contrat_renouvellement_remplacement,
          },
          'mock-user-id',
          '1'
        );

        if (result.reminderCreated) {
          setReminderMessage(result.message);
          setShowReminderSuccess(true);
          setTimeout(() => {
            setShowReminderSuccess(false);
            onClose();
          }, 2000);
        } else {
          onClose();
        }
      } catch (error) {
        console.error('Erreur lors de la création du rappel:', error);
        onClose();
      }
    } else {
      onClose();
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl my-4 pointer-events-auto max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
              {editContract ? 'Éditer le contrat' : 'Ajouter un nouveau contrat'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Section Général */}
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Informations générales</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Nom de l'assureur */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      <span className="text-red-500">*</span> Nom de l'assureur
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchAssureur || formData.assureur}
                        onChange={(e) => {
                          setSearchAssureur(e.target.value);
                          handleAssureurChange(e.target.value);
                        }}
                        onFocus={() => setSearchAssureur(formData.assureur)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder="Rechercher un assureur..."
                      />
                      {searchAssureur && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 max-h-60 overflow-y-auto z-20">
                          {filteredAssureurs.map((assureur) => (
                            <button
                              key={assureur}
                              type="button"
                              onClick={() => {
                                handleAssureurChange(assureur);
                                setSearchAssureur('');
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-light text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                            >
                              {assureur}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gamme de contrat (now using produit field) */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      <span className="text-red-500">*</span> Gamme de contrat
                    </label>
                    {formData.assureur && availableProducts.length > 0 ? (
                      <>
                        <select
                          value={formData.produit}
                          onChange={(e) => handleProductChange(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        >
                          <option value="">Sélectionner...</option>
                          {availableProducts.map((product) => (
                            <option key={product.name} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                        {selectedProduct && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Rémunération: {selectedProduct.remuneration}
                          </p>
                        )}
                      </>
                    ) : (
                      <select
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      >
                        <option value="">Sélectionner d'abord un assureur...</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-8 mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.en_portefeuille}
                      onChange={(e) => setFormData({ ...formData, en_portefeuille: e.target.checked })}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">En portefeuille</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.loi_madelin}
                      onChange={(e) => setFormData({ ...formData, loi_madelin: e.target.checked })}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">Loi Madelin</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.contrat_principal}
                      onChange={(e) => setFormData({ ...formData, contrat_principal: e.target.checked })}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">Contrat principal</span>
                  </label>
                </div>

                {/* Assureurs interrogés - Always visible after product selection */}
                {formData.produit && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20/50 rounded-2xl border border-blue-200 dark:border-blue-700/50 mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assureurs interrogés pour comparaison
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {assureursInterroges.length > 0 ? (
                        assureursInterroges.map((assureur, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 text-blue-700 rounded-full text-xs font-light"
                          >
                            {assureur}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 text-blue-700 rounded-full text-xs font-light">
                          {formData.assureur}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Ces assureurs ont été consultés pour comparer les offres disponibles
                    </p>
                  </div>
                )}
              </div>

              {/* Section Dates */}
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Dates</h3>
                <div className="grid grid-cols-3 gap-6">
                {/* Date de souscription */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Date de souscription
                  </label>
                  <input
                    type="date"
                    value={formData.date_souscription}
                    onChange={(e) => setFormData({ ...formData, date_souscription: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>

                {/* Date d'effet */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Date d'effet
                  </label>
                  <input
                    type="date"
                    value={formData.date_effet}
                    onChange={(e) => setFormData({ ...formData, date_effet: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>

                {/* Date d'échéance */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={formData.date_echeance}
                    onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
              </div>
              </div>

              {/* Section Financier */}
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Informations financières</h3>
                <div className="space-y-6">
                  {/* Standard fields - always visible */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Montant initial */}
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Montant initial (€)
                      </label>
                      <input
                        type="text"
                        value={formData.montant_initial}
                        onChange={(e) => setFormData({ ...formData, montant_initial: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder=""
                      />
                    </div>

                    {/* Versement programmé */}
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Versement programmé (€)
                      </label>
                      <input
                        type="text"
                        value={formData.versement_programme}
                        onChange={(e) => setFormData({ ...formData, versement_programme: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Périodicité */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      Périodicité
                    </label>
                    <select
                      value={formData.periodicite}
                      onChange={(e) => setFormData({ ...formData, periodicite: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Mensuel">Mensuel</option>
                      <option value="Trimestriel">Trimestriel</option>
                      <option value="Semestriel">Semestriel</option>
                      <option value="Annuel">Annuel</option>
                    </select>
                  </div>

                  {/* Dynamic fields based on selected product */}
                  {selectedProduct && selectedProduct.fields && selectedProduct.fields.length > 0 && (
                    <div className="space-y-6 p-4 bg-blue-50 dark:bg-blue-900/20/30 rounded-2xl border border-blue-200 dark:border-blue-700/30">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Champs spécifiques au produit</h4>

                      <div className="grid grid-cols-2 gap-6">
                        {selectedProduct.fields.map((field) => {
                          switch (field.type) {
                            case 'versement_initial':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.required && <span className="text-red-500">* </span>}
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.versement_initial}
                                    onChange={(e) => setFormData({ ...formData, versement_initial: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    placeholder=""
                                  />
                                  {field.note && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.note}</p>}
                                </div>
                              );

                            case 'mma_elite':
                              return (
                                <div key={field.type} className="flex items-center">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.mma_elite}
                                      onChange={(e) => setFormData({ ...formData, mma_elite: e.target.checked })}
                                      className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">{field.label}</span>
                                  </label>
                                </div>
                              );

                            case 'frais_versement':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.frais_versement}
                                    onChange={(e) => setFormData({ ...formData, frais_versement: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    placeholder="%"
                                  />
                                </div>
                              );

                            case 'vp_optionnel':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.vp_optionnel}
                                    onChange={(e) => setFormData({ ...formData, vp_optionnel: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    placeholder=""
                                  />
                                </div>
                              );

                            case 'frais_a_definir':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.frais_a_definir}
                                    onChange={(e) => setFormData({ ...formData, frais_a_definir: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    placeholder=""
                                  />
                                </div>
                              );

                            case 'date_effet_supplementaire':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="date"
                                    value={formData.date_effet_supplementaire}
                                    onChange={(e) => setFormData({ ...formData, date_effet_supplementaire: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                  />
                                </div>
                              );

                            case 'frais_chacun':
                              return (
                                <div key={field.type}>
                                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.frais_chacun}
                                    onChange={(e) => setFormData({ ...formData, frais_chacun: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    placeholder="%"
                                  />
                                </div>
                              );

                            default:
                              return null;
                          }
                        })}
                      </div>
                    </div>
                  )}

                  {/* Legacy fields - Champs Assurance emprunteur */}
                  {formData.gamme_contrat === 'Assurance emprunteur' && !selectedProduct && (
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Frais de dossier (€)
                      </label>
                      <input
                        type="text"
                        value={formData.frais_dossier}
                        onChange={(e) => setFormData({ ...formData, frais_dossier: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        placeholder="Montant des frais de dossier"
                      />
                    </div>
                  )}

                </div>
              </div>

              {/* Section Rappels Automatiques Conditionnels */}
              {formData.produit && shouldShowPERExistantField(formData.produit) && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Plan Épargne Retraite (PER)</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour les contrats PER</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={formData.per_existant}
                      onChange={(e) => setFormData({ ...formData, per_existant: e.target.checked })}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">PER déjà existant</span>
                  </label>
                  {formData.per_existant && (
                    <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-light">
                        ✓ Un rappel sera automatiquement créé : "Faire demande de transfert + suspension des versements sur l'ancien PER"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formData.produit && shouldShowAssuranceVieExistanteField(formData.produit) && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Assurance Vie / Épargne</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour l'assurance vie</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={formData.assurance_vie_existante}
                      onChange={(e) => setFormData({ ...formData, assurance_vie_existante: e.target.checked })}
                      className="w-4 h-4 text-green-600 dark:text-green-400 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm font-light text-gray-700 dark:text-gray-300">Assurance vie déjà existante</span>
                  </label>
                  {formData.assurance_vie_existante && (
                    <div className="mt-3 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rachat_effectue}
                          onChange={(e) => setFormData({ ...formData, rachat_effectue: e.target.checked })}
                          className="w-4 h-4 text-green-600 dark:text-green-400 rounded border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">Avez-vous effectué un rachat total ou partiel ?</span>
                      </label>
                      {formData.rachat_effectue && (
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <p className="text-xs text-green-700 dark:text-green-300 font-light">
                            ✓ Un rappel sera automatiquement créé : "Suivi du rachat total ou partiel"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {formData.produit && shouldShowMutuelleReminder(formData.produit) && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Mutuelle Santé</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Un rappel automatique sera créé pour ce type de contrat</p>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                        <p className="text-xs text-orange-700 dark:text-orange-300 font-light">
                          ✓ Rappel automatique : "Avez-vous fait la RIA ?" (Résiliation Infra-Annuelle)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.produit && shouldShowPrevoyanceRenouvellementField(formData.produit) && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Prévoyance</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour les contrats de prévoyance</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      Le contrat est-il en renouvellement ou en remplacement ?
                    </label>
                    <select
                      value={formData.contrat_renouvellement_remplacement}
                      onChange={(e) => setFormData({ ...formData, contrat_renouvellement_remplacement: e.target.value as 'nouveau' | 'renouvellement' | 'remplacement' | '' })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="nouveau">Nouveau contrat</option>
                      <option value="renouvellement">Renouvellement</option>
                      <option value="remplacement">Remplacement</option>
                    </select>
                    {(formData.contrat_renouvellement_remplacement === 'renouvellement' || formData.contrat_renouvellement_remplacement === 'remplacement') && (
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                        <p className="text-xs text-red-700 dark:text-red-300 font-light">
                          ✓ Un rappel sera automatiquement créé : "Avez-vous effectué la RIA (résiliation ou non reconduction) ?"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.produit && shouldShowAssuranceEmprunteurReminder(formData.produit) && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Assurance Emprunteur</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Un rappel automatique sera créé dans 3 semaines</p>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-light">
                          ✓ Rappel automatique (J+21) : "Appeler le client pour vérification de l'avenant bancaire"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Commentaires - Moved to the end */}
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Commentaires</h3>
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Commentaires
                  </label>
                  <textarea
                    value={formData.commentaires}
                    onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 bg-white dark:bg-gray-900 rounded-b-3xl flex-shrink-0">
            {showReminderSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl">
                <p className="text-sm text-green-700 dark:text-green-300 font-light text-center">
                  ✓ {reminderMessage}
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
              >
                Ajouter et fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
