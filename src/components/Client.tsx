import { Bell, FileDown, Filter, X, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { useState } from 'react';

interface ClientProps {
  onNotificationClick: () => void;
  notificationCount: number;
  initialShowPending?: boolean;
}

interface ClientSubscription {
  id: string;
  date: string;
  subscriber: string;
  product: string;
  amount: string;
  status: string;
  manager: string;
  apporteur?: string;
}

type TabType = 'ma-production' | 'apporteur';

export default function Client({ onNotificationClick, notificationCount, initialShowPending = false }: ClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ma-production');
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(initialShowPending);
  const [apporteurSearch, setApporteurSearch] = useState('');
  const [selectedDossier, setSelectedDossier] = useState<ClientSubscription | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const mockSubscriptions: ClientSubscription[] = [
    { id: '1', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'OMÉGA', amount: '€4 200', status: 'Validé', manager: 'ZAOUI CONSULTING', apporteur: 'Sophie Martin' },
    { id: '2', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'OMÉGA', amount: '€100', status: 'Non validé', manager: 'ZAOUI CONSULTING' },
    { id: '3', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'MMA ELITE - PER', amount: '€350', status: 'En cours d\'étude', manager: 'ZAOUI CONSULTING' },
    { id: '4', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'SIGNATURE PER', amount: '€4 200', status: 'Mise en demeure', manager: 'ZAOUI CONSULTING' },
    { id: '5', date: 'Oct 2025', subscriber: 'Pamela Victoria Zaoui', product: 'APRIL/IARD', amount: '€302,76', status: 'Date d\'effet', manager: 'ZAOUI CONSULTING' },
    { id: '6', date: 'Oct 2025', subscriber: 'Blanche Mariette Jean-Louis', product: 'LA RETRAITE 0.95', amount: '€1 800', status: 'En instance', manager: 'ZAOUI CONSULTING' },
    { id: '7', date: 'Oct 2025', subscriber: 'Leo Blanca', product: 'OMÉGA', amount: '€1 200', status: 'En attente de transfert', manager: 'ZAOUI CONSULTING' },
    { id: '8', date: 'Oct 2025', subscriber: 'Leo Blanca', product: 'OMÉGA', amount: '€100', status: 'En attente documents', manager: 'ZAOUI CONSULTING' },
    { id: '9', date: 'Oct 2025', subscriber: 'Alexia Guerin', product: 'SELECT PRO 40/10', amount: '€1 865,04', status: 'Reprise', manager: 'ZAOUI CONSULTING' },
    { id: '10', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'LA RETRAITE 0.95', amount: '€9 000', status: 'Reprise ok', manager: 'ZAOUI CONSULTING' },
    { id: '11', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'SWISSLIFE PREVOYANCE 30/10', amount: '€1 349,76', status: 'Inexistant', manager: 'ZAOUI CONSULTING' },
    { id: '12', date: 'Oct 2025', subscriber: 'Benjamin Benchabatt', product: 'SWISSLIFE MUTUELLE 30/10', amount: '€1 560', status: 'Process de sortie & Règlement intérieur', manager: 'ZAOUI CONSULTING' },
    { id: '13', date: 'Oct 2025', subscriber: 'Raphael Yana', product: 'OMÉGA', amount: '€6 000', status: 'Acte non-rémunéré validé', manager: 'ZAOUI CONSULTING' },
    { id: '14', date: 'Oct 2025', subscriber: 'Raphael Yana', product: 'OMÉGA', amount: '€50', status: 'Acte non-rémunéré validé ok', manager: 'ZAOUI CONSULTING' },
    { id: '15', date: 'Oct 2025', subscriber: 'Marie Pothin', product: 'OMÉGA', amount: '€1 200', status: 'En cours d\'étude - Interne', manager: 'ZAOUI CONSULTING' },
    { id: '16', date: 'Oct 2025', subscriber: 'Sophie Martin', product: 'PREMIUM SANTÉ', amount: '€2 500', status: 'Classé sans suite', manager: 'MARTIN CONSULTING' },
    { id: '17', date: 'Oct 2025', subscriber: 'Thomas Dubois', product: 'PER INDIVIDUEL', amount: '€3 800', status: 'Générali UC < 50%', manager: 'MARTIN CONSULTING' },
    { id: '18', date: 'Oct 2025', subscriber: 'Julie Petit', product: 'ASSURANCE VIE', amount: '€5 200', status: 'A valider - Jon ILLOUZ', manager: 'PETIT CONSULTING' },
    { id: '19', date: 'Oct 2025', subscriber: 'Marc Leroy', product: 'RETRAITE COMPLÉMENTAIRE', amount: '€1 900', status: 'RA', manager: 'LEROY CONSULTING' },
    { id: '20', date: 'Oct 2025', subscriber: 'Claire Bernard', product: 'MUTUELLE FAMILLE', amount: '€890', status: 'Augmentation', manager: 'BERNARD CONSULTING' },
    { id: '21', date: 'Oct 2025', subscriber: 'Pierre Moreau', product: 'PRÉVOYANCE PRO', amount: '€1 650', status: 'Diminution', manager: 'MOREAU CONSULTING' },
    { id: '22', date: 'Oct 2025', subscriber: 'Isabelle Laurent', product: 'ÉPARGNE SALARIALE', amount: '€4 100', status: 'FRIGO SUR CONTRAT', manager: 'LAURENT CONSULTING' },
    { id: '23', date: 'Oct 2025', subscriber: 'Antoine Simon', product: 'ASSURANCE HABITATION', amount: '€780', status: 'Refus de garantir', manager: 'SIMON CONSULTING' },
    { id: '24', date: 'Oct 2025', subscriber: 'Nathalie Blanc', product: 'AUTO PREMIUM', amount: '€1 420', status: 'Validé', manager: 'BLANC CONSULTING', apporteur: 'Thomas Dubois' },
    { id: '25', date: 'Oct 2025', subscriber: 'François Garnier', product: 'SANTÉ SENIOR', amount: '€2 100', status: 'En cours d\'étude', manager: 'GARNIER CONSULTING' },
    { id: '26', date: 'Oct 2025', subscriber: 'Laurent Petit', product: 'PER ELITE', amount: '€5 600', status: 'Validé', manager: 'ZAOUI CONSULTING', apporteur: 'Marie Pothin' },
  ];

  const dossiersValides = mockSubscriptions.filter(s => s.status === 'Validé');
  const dossiersEnAttenteMaProduction = mockSubscriptions.filter(s => s.status !== 'Validé');

  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesName = filterName === '' || sub.subscriber.toLowerCase().includes(filterName.toLowerCase());
    const matchesProduct = filterProduct === '' || sub.product.toLowerCase().includes(filterProduct.toLowerCase());
    const matchesStatus = filterStatus === '' || sub.status === filterStatus;
    const matchesApporteur = apporteurSearch === '' || (sub.apporteur && sub.apporteur.toLowerCase().includes(apporteurSearch.toLowerCase()));

    if (activeTab === 'ma-production' && showOnlyPending) {
      return matchesName && matchesProduct && matchesStatus && sub.status !== 'Validé';
    }

    if (activeTab === 'apporteur') {
      return sub.status === 'Validé' && sub.apporteur && matchesName && matchesProduct && matchesStatus && matchesApporteur;
    }

    return matchesName && matchesProduct && matchesStatus;
  });

  const dossiersEnAttente = mockSubscriptions.filter(s => s.status !== 'Validé');

  const handleDossierClick = (dossier: ClientSubscription) => {
    setSelectedDossier(dossier);
    setShowCompletionModal(true);
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
    setSelectedDossier(null);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilterName('');
    setFilterProduct('');
    setFilterStatus('');
  };

  const tabs = [
    { id: 'ma-production' as TabType, label: 'Ma production' },
    { id: 'apporteur' as TabType, label: 'Apporteur d\'affaire' },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Clients</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-light mt-1 hidden sm:block">Gérer vos productions et souscriptions</p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 flex items-center justify-center transition-all hover:scale-105 shadow-sm relative"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-hidden flex flex-col">
        <div className="glass-card floating-shadow overflow-hidden relative flex-1 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-4 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-light whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {activeTab === 'apporteur' && (
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher un apporteur d'affaire..."
                      value={apporteurSearch}
                      onChange={(e) => setApporteurSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>
                )}
                {activeTab === 'ma-production' && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                        <span className="font-medium">{dossiersValides.length}</span> dossiers validés
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                        <span className="font-medium">{dossiersEnAttenteMaProduction.length}</span> dossiers en attente
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {activeTab === 'ma-production' && (
                    <button
                      onClick={() => setShowOnlyPending(!showOnlyPending)}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-light transition-all ${
                        showOnlyPending
                          ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Voir dossiers en attente
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-light text-white dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <Filter className="w-4 h-4 text-white dark:text-gray-300" />
                    Filtres
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
                        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[600px]">
                          <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
                            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Filtres</h2>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                            >
                              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                          </div>

                          <div className="p-6 space-y-4">
                            <div>
                              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                              <input
                                type="text"
                                placeholder="Rechercher par nom"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Produit</label>
                              <input
                                type="text"
                                placeholder="Rechercher par produit"
                                value={filterProduct}
                                onChange={(e) => setFilterProduct(e.target.value)}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">État du dossier</label>
                              <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                              >
                                <option value="">Tous les états</option>
                                <option value="Validé">Validé</option>
                                <option value="Non validé">Non validé</option>
                                <option value="Mise en demeure">Mise en demeure</option>
                                <option value="Date d'effet">Date d'effet</option>
                                <option value="En instance">En instance</option>
                                <option value="En attente de transfert">En attente de transfert</option>
                                <option value="En attente documents">En attente documents</option>
                                <option value="Reprise">Reprise</option>
                                <option value="Reprise ok">Reprise ok</option>
                                <option value="En cours d'étude">En cours d'étude</option>
                                <option value="Inexistant">Inexistant</option>
                                <option value="Process de sortie & Règlement intérieur">Process de sortie & Règlement intérieur</option>
                                <option value="Acte non-rémunéré validé">Acte non-rémunéré validé</option>
                                <option value="Acte non-rémunéré validé ok">Acte non-rémunéré validé ok</option>
                                <option value="En cours d'étude - Interne">En cours d'étude - Interne</option>
                                <option value="Classé sans suite">Classé sans suite</option>
                                <option value="Générali UC < 50%">Générali UC &lt; 50%</option>
                                <option value="A valider - Jon ILLOUZ">A valider - Jon ILLOUZ</option>
                                <option value="RA">RA</option>
                                <option value="Augmentation">Augmentation</option>
                                <option value="Diminution">Diminution</option>
                                <option value="FRIGO SUR CONTRAT">FRIGO SUR CONTRAT</option>
                                <option value="Refus de garantir">Refus de garantir</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30 flex gap-3">
                            <button
                              onClick={handleResetFilters}
                              className="flex-1 px-5 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-light hover:bg-white dark:hover:bg-gray-800 transition-all"
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
          </div>

          <div className="flex-1 overflow-auto">
              <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    Souscripteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    Montant souscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    État du dossier
                  </th>
                  {activeTab === 'apporteur' && (
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                      Apporteur d'affaire
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-700">
                    Mandataire
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {filteredSubscriptions.map((subscription) => (
                  <tr
                    key={subscription.id}
                    onClick={() => {
                      if (activeTab === 'ma-production' && subscription.status !== 'Validé') {
                        handleDossierClick(subscription);
                      }
                    }}
                    className={`hover:bg-gray-50 transition-colors ${
                      activeTab === 'ma-production' && subscription.status !== 'Validé' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {subscription.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {formatName(subscription.subscriber)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {subscription.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {subscription.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {subscription.status === 'Validé' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-green-100 text-green-700">
                          Validé
                        </span>
                      )}
                      {subscription.status === 'Non validé' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-pink-100 text-pink-700">
                          Non validé
                        </span>
                      )}
                      {subscription.status === 'Mise en demeure' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-pink-200 text-pink-800">
                          Mise en demeure
                        </span>
                      )}
                      {subscription.status === "Date d'effet" && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-red-600 text-white">
                          Date d'effet
                        </span>
                      )}
                      {subscription.status === 'En instance' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-purple-900 text-purple-100">
                          En instance
                        </span>
                      )}
                      {subscription.status === 'En attente de transfert' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-orange-200 text-orange-800">
                          En attente de transfert
                        </span>
                      )}
                      {subscription.status === 'En attente documents' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-amber-700 text-amber-100">
                          En attente documents
                        </span>
                      )}
                      {subscription.status === 'Reprise' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-violet-600 text-white">
                          Reprise
                        </span>
                      )}
                      {subscription.status === 'Reprise ok' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-slate-600 text-slate-100">
                          Reprise ok
                        </span>
                      )}
                      {subscription.status === "En cours d'étude" && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-gray-500 text-gray-100">
                          En cours d'étude
                        </span>
                      )}
                      {subscription.status === 'Inexistant' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-slate-500 text-slate-100">
                          Inexistant
                        </span>
                      )}
                      {subscription.status === 'Process de sortie & Règlement intérieur' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-slate-700 text-slate-100">
                          Process de sortie & Règlement intérieur
                        </span>
                      )}
                      {subscription.status === 'Acte non-rémunéré validé' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-violet-600 text-white">
                          Acte non-rémunéré validé
                        </span>
                      )}
                      {subscription.status === 'Acte non-rémunéré validé ok' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-slate-600 text-slate-100">
                          Acte non-rémunéré validé ok
                        </span>
                      )}
                      {subscription.status === "En cours d'étude - Interne" && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-red-900 text-red-100">
                          En cours d'étude - Interne
                        </span>
                      )}
                      {subscription.status === 'Classé sans suite' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-teal-700 text-teal-100">
                          Classé sans suite
                        </span>
                      )}
                      {subscription.status === 'Générali UC < 50%' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-yellow-500 text-yellow-900">
                          Générali UC &lt; 50%
                        </span>
                      )}
                      {subscription.status === 'A valider - Jon ILLOUZ' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-cyan-500 text-cyan-950">
                          A valider - Jon ILLOUZ
                        </span>
                      )}
                      {subscription.status === 'RA' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-slate-700 text-slate-100">
                          RA
                        </span>
                      )}
                      {subscription.status === 'Augmentation' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-blue-600 text-blue-100">
                          Augmentation
                        </span>
                      )}
                      {subscription.status === 'Diminution' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-orange-500 text-orange-50">
                          Diminution
                        </span>
                      )}
                      {subscription.status === 'FRIGO SUR CONTRAT' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-teal-500 text-teal-950">
                          FRIGO SUR CONTRAT
                        </span>
                      )}
                      {subscription.status === 'Refus de garantir' && (
                        <span className="inline-flex px-3 py-1 text-xs font-light rounded-full bg-purple-700 text-purple-100">
                          Refus de garantir
                        </span>
                      )}
                    </td>
                    {activeTab === 'apporteur' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                        {subscription.apporteur ? formatName(subscription.apporteur) : '-'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {subscription.manager}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCompletionModal && selectedDossier && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={handleCloseModal} />
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Compléter le dossier</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatName(selectedDossier.subscriber)} - {selectedDossier.product}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Raison de l'attente: {selectedDossier.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Documents manquants</label>
                    <textarea
                      placeholder="Décrire les documents ou informations manquantes..."
                      rows={3}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Actions effectuées</label>
                    <textarea
                      placeholder="Décrire les actions entreprises pour débloquer le dossier..."
                      rows={3}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Date prévue de résolution</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Notes complémentaires</label>
                    <textarea
                      placeholder="Ajouter des notes..."
                      rows={2}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30 flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-light hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    alert('Informations enregistrées');
                    handleCloseModal();
                  }}
                  className="flex-1 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
