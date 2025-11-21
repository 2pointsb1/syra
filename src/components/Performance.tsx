import { Bell, Search } from 'lucide-react';
import { useState } from 'react';

interface PerformanceProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Performance({ onNotificationClick, notificationCount }: PerformanceProps) {
  const [startDate, setStartDate] = useState('2025-11-07');
  const [endDate, setEndDate] = useState('2025-11-21');
  const [selectedList, setSelectedList] = useState('Toutes les listes');
  const [searchUser, setSearchUser] = useState('');

  const kpis = [
    { label: 'Leads travaillés', value: '5530' },
    { label: 'RDV pris', value: '399' },
    { label: 'Ventes', value: '11' },
    { label: 'RDV / total', value: '7.2%' },
    { label: 'Taux de signature RDV', value: '2.8%' },
    { label: 'Faux numéros', value: '13.2%' },
  ];

  const userPerformances = [
    { name: 'Moche Azran (M)', leadsWorked: 5, rdvTaken: 0, signed: 1 },
    { name: 'Henoc Nsumbu', leadsWorked: 568, rdvTaken: 16, signed: 0 },
    { name: 'Romain Camesciali', leadsWorked: 171, rdvTaken: 3, signed: 0 },
    { name: 'Sophie Azuelos', leadsWorked: 11, rdvTaken: 2, signed: 0 },
    { name: 'David Bouaziz', leadsWorked: 1068, rdvTaken: 42, signed: 0 },
  ];

  const generateLineChartData = (points: number) => {
    const data = [];
    for (let i = 0; i < points; i++) {
      data.push(Math.random() * 2000 + 500);
    }
    return data;
  };

  const generateDates = (days: number) => {
    const dates = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''));
    }
    return dates;
  };

  const leadsData = generateLineChartData(14);
  const rdvData = generateLineChartData(14);
  const dates = generateDates(13);

  const maxLeads = Math.max(...leadsData);
  const maxRdv = Math.max(...rdvData);

  const createSVGPath = (data: number[], max: number, width: number, height: number) => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Performance</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Analysez vos données et optimisez vos résultats</p>
        </div>
        <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-105 relative flex-shrink-0">
          <Bell className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="glass-card p-6 floating-shadow mb-6">
          <h2 className="text-lg font-light text-gray-900 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-light mb-2">Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-light mb-2">Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-light mb-2">Liste</label>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              >
                <option>Toutes les listes</option>
                <option>Professions médicales</option>
                <option>Nouveaux leads</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-light mb-2">Recherche utilisateur</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Rechercher un utilisateur..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="glass-card p-4 floating-shadow text-center">
              <p className="text-xs text-gray-600 font-light mb-2">{kpi.label}</p>
              <p className="text-2xl md:text-3xl font-light text-blue-600">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 floating-shadow mb-6">
          <h2 className="text-lg font-light text-gray-900 mb-4">Performances utilisateurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-light text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-light text-gray-600">Leads travaillés</th>
                  <th className="px-4 py-3 text-left text-sm font-light text-gray-600">RDV pris</th>
                  <th className="px-4 py-3 text-left text-sm font-light text-gray-600">Signé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userPerformances.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-light text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm font-light text-gray-700">{user.leadsWorked}</td>
                    <td className="px-4 py-3 text-sm font-light text-gray-700">{user.rdvTaken}</td>
                    <td className="px-4 py-3 text-sm font-light text-gray-700">{user.signed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow mb-6 md:mb-8">
          <div className="space-y-12">
            <div>
              <h4 className="text-base font-light text-gray-900 mb-6">Leads utilisés par jour</h4>
              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={createSVGPath(leadsData, maxLeads, 1000, 180) + ' L 1000,200 L 0,200 Z'}
                    fill="url(#lineGradient1)"
                  />

                  <path
                    d={createSVGPath(leadsData, maxLeads, 1000, 180)}
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {leadsData.map((value, index) => {
                    const x = (index / (leadsData.length - 1)) * 1000;
                    const y = 180 - (value / maxLeads) * 180;
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#818CF8"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 font-light"
                          style={{ fontSize: '10px' }}
                        >
                          {Math.round(value)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between mt-4">
                  {dates.map((date, index) => (
                    <span key={index} className="text-xs text-gray-400 font-light transform -rotate-45 origin-left">
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-12">
              <h4 className="text-base font-light text-gray-900 mb-6">Rendez-vous pris par jour</h4>
              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={createSVGPath(rdvData, maxRdv, 1000, 180) + ' L 1000,200 L 0,200 Z'}
                    fill="url(#lineGradient2)"
                  />

                  <path
                    d={createSVGPath(rdvData, maxRdv, 1000, 180)}
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {rdvData.map((value, index) => {
                    const x = (index / (rdvData.length - 1)) * 1000;
                    const y = 180 - (value / maxRdv) * 180;
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#818CF8"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 font-light"
                          style={{ fontSize: '10px' }}
                        >
                          {Math.round(value)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between mt-4">
                  {dates.map((date, index) => (
                    <span key={index} className="text-xs text-gray-400 font-light transform -rotate-45 origin-left">
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
