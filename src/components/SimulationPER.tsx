import { Bell, Send, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Lead } from '../types';
import { supabase } from '../lib/supabase';

interface SimulationPERProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function SimulationPER({ onNotificationClick, notificationCount }: SimulationPERProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [professionalStatus, setProfessionalStatus] = useState<'Salarié' | 'Indépendant'>('Salarié');
  const [annualIncome, setAnnualIncome] = useState(0);
  const [taxCeiling, setTaxCeiling] = useState(0);

  const [monthlyContribution, setMonthlyContribution] = useState(350);
  const [investorProfile, setInvestorProfile] = useState<'Prudent' | 'Équilibré' | 'Dynamique'>('Équilibré');
  const [maritalStatus, setMaritalStatus] = useState<'Célibataire, divorcé(e), veuf(ve)' | 'Couple marié ou pacsé'>('Célibataire, divorcé(e), veuf(ve)');
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [age, setAge] = useState(18);
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxRate, setTaxRate] = useState('30%');

  const [investedCapital, setInvestedCapital] = useState(0);
  const [generatedCapital, setGeneratedCapital] = useState(0);
  const [totalCapital, setTotalCapital] = useState(0);
  const [totalTaxSavings, setTotalTaxSavings] = useState(0);
  const [returnRate, setReturnRate] = useState(6);

  useEffect(() => {
    calculateTaxCeiling();
  }, [professionalStatus, annualIncome]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchLeads(searchQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const searchLeads = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching leads:', error);
      setSearchResults([]);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setClientFirstName(lead.first_name);
    setClientLastName(lead.last_name);
    setClientEmail(lead.email || '');
    setSearchQuery(`${lead.first_name} ${lead.last_name}`);
    setShowSearchResults(false);
  };

  useEffect(() => {
    calculateCapitals();
  }, [monthlyContribution, investorProfile, age]);

  useEffect(() => {
    calculateTaxSavings();
  }, [monthlyContribution, taxRate]);

  const calculateTaxCeiling = () => {
    if (professionalStatus === 'Salarié') {
      const ceiling = Math.min(annualIncome * 0.1, 35194);
      setTaxCeiling(Math.round(ceiling));
    } else {
      const ceiling = Math.min(annualIncome * 0.1 + 16097, 35194 + 16097);
      setTaxCeiling(Math.round(ceiling));
    }
  };

  const calculateCapitals = () => {
    const retirementAge = 67;
    const yearsUntilRetirement = Math.max(retirementAge - age, 1);
    const monthsUntilRetirement = yearsUntilRetirement * 12;

    let rate = 6;
    if (investorProfile === 'Prudent') rate = 3;
    else if (investorProfile === 'Équilibré') rate = 5;
    else if (investorProfile === 'Dynamique') rate = 7;
    setReturnRate(rate);

    const monthlyRate = rate / 100 / 12;
    const invested = monthlyContribution * monthsUntilRetirement;

    let future = 0;
    if (monthlyRate > 0) {
      future = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsUntilRetirement) - 1) / monthlyRate);
    } else {
      future = invested;
    }

    const generated = future - invested;

    setInvestedCapital(Math.round(invested));
    setGeneratedCapital(Math.round(generated));
    setTotalCapital(Math.round(future));
  };

  const calculateTaxSavings = () => {
    const annualContribution = monthlyContribution * 12;
    let rate = 0;

    switch(taxRate) {
      case '0%': rate = 0; break;
      case '11%': rate = 0.11; break;
      case '30%': rate = 0.30; break;
      case '41%': rate = 0.41; break;
      case '45%': rate = 0.45; break;
    }

    const savings = annualContribution * rate;
    setTotalTaxSavings(Math.round(savings));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  const handleSendEmail = () => {
    alert('Simulation envoyée par email');
  };

  const circlePercentage = (returnRate / 10) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (circumference * circlePercentage) / 100;

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Simulation PER</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">
            Simulez et optimisez votre Plan Épargne Retraite
          </p>
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

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6">
        <div className="glass-card p-6 floating-shadow">
          <h2 className="text-lg font-light text-gray-900 mb-4">Rechercher un lead</h2>
          <div className="search-container relative">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Rechercher un lead..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-[200] w-full mt-2 glass-card floating-shadow max-h-60 overflow-y-auto">
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
          {selectedLead && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Lead sélectionné:</p>
              <p className="text-sm text-gray-700">{selectedLead.first_name} {selectedLead.last_name}</p>
              {selectedLead.email && <p className="text-xs text-gray-600">{selectedLead.email}</p>}
            </div>
          )}
        </div>

        <div className="glass-card p-8 floating-shadow">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Calculer le plafond de déductibilité de votre Plan Épargne Retraite individuel
          </h2>
          <p className="text-sm font-light text-gray-700 mb-6">
            Calculez le montant maximum que vous pouvez déduire de vos impôts selon votre situation professionnelle.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Situation professionnelle</label>
                <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setProfessionalStatus('Salarié')}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-light transition-all ${
                      professionalStatus === 'Salarié'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Salarié
                  </button>
                  <button
                    onClick={() => setProfessionalStatus('Indépendant')}
                    className={`flex-1 px-6 py-2 rounded-full text-sm font-light transition-all ${
                      professionalStatus === 'Indépendant'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Indépendant
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Montant de vos revenus annuels</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-light">€</span>
                  <input
                    type="number"
                    value={annualIncome || ''}
                    onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-normal"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-xl text-center min-w-[280px]">
                <div className="text-5xl font-light text-white mb-3">
                  {formatCurrency(taxCeiling)}
                </div>
                <p className="text-sm font-light text-blue-100">
                  Votre disponible fiscal<br />pour l'année 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 floating-shadow">
          <h2 className="text-2xl font-light text-gray-900 mb-2">Simuler mon Épargne Retraite</h2>
          <p className="text-sm font-light text-gray-700 mb-6">
            Découvrez en détails votre situation d'épargne à moyen et long terme lorsque vous optez pour le Plan Épargne Retraite.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="0.3em"
                    className="text-3xl font-light fill-gray-700"
                    transform="rotate(90 100 100)"
                  >
                    {returnRate}%
                  </text>
                  <text
                    x="100"
                    y="130"
                    textAnchor="middle"
                    className="text-xs font-light fill-gray-500"
                    transform="rotate(90 100 100)"
                  >
                    taux de rendement*
                  </text>
                </svg>
              </div>

              <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-gray-700">Capital investi :</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(investedCapital)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-blue-500"></div>
                    <span className="text-sm font-light text-gray-700">Capital généré :</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(generatedCapital)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-light text-gray-700">Capital constitué :</span>
                  <span className="text-base font-medium text-gray-900">{formatCurrency(totalCapital)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Versement mensuel</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-light">€</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Profil investisseur</label>
                <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setInvestorProfile('Prudent')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-light transition-all ${
                      investorProfile === 'Prudent'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Prudent
                  </button>
                  <button
                    onClick={() => setInvestorProfile('Équilibré')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-light transition-all ${
                      investorProfile === 'Équilibré'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Équilibré
                  </button>
                  <button
                    onClick={() => setInvestorProfile('Dynamique')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-light transition-all ${
                      investorProfile === 'Dynamique'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dynamique
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Situation maritale</label>
                <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setMaritalStatus('Célibataire, divorcé(e), veuf(ve)')}
                    className={`flex-1 px-4 py-2 rounded-full text-xs font-light transition-all ${
                      maritalStatus === 'Célibataire, divorcé(e), veuf(ve)'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Célibataire, divorcé(e), veuf(ve)
                  </button>
                  <button
                    onClick={() => setMaritalStatus('Couple marié ou pacsé')}
                    className={`flex-1 px-4 py-2 rounded-full text-xs font-light transition-all ${
                      maritalStatus === 'Couple marié ou pacsé'
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Couple marié ou pacsé
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Nombre d'enfants</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(numberOfChildren / 5) * 100}%, #e5e7eb ${(numberOfChildren / 5) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="mt-2 text-center bg-white border border-gray-200 rounded-lg py-2 px-4 inline-block">
                  <span className="text-sm font-medium text-gray-900">{numberOfChildren} enfants</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Votre âge</label>
                <input
                  type="range"
                  min="18"
                  max="67"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((age - 18) / (67 - 18)) * 100}%, #e5e7eb ${((age - 18) / (67 - 18)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="mt-2 text-center bg-white border border-gray-200 rounded-lg py-2 px-4 inline-block">
                  <span className="text-sm font-medium text-gray-900">{age} ans</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Revenus imposables du foyer</label>
                <input
                  type="number"
                  value={taxableIncome || ''}
                  onChange={(e) => setTaxableIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-normal"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">Taux imposition - Tranche impôts 2025</label>
                <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                  {['0%', '11%', '30%', '41%', '45%'].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setTaxRate(rate)}
                      className={`flex-1 px-3 py-2 rounded-full text-xs font-light transition-all ${
                        taxRate === rate
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-gray-700">Économie fiscale totale :</span>
                  <span className="text-lg font-medium text-gray-900">{formatCurrency(totalTaxSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 floating-shadow">
          <p className="text-xs font-light text-gray-600 mb-4">
            * Valeurs indicatives : le profil prudent concerne les indépendants soucieux de la pérennité de leur épargne,
            le profil équilibré correspond à un équilibre entre performance financière et épargne sécurisée, le profil
            dynamique s'adresse à des épargnants désireux d'obtenir des performances élevées.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleSendEmail}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer la simulation
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
