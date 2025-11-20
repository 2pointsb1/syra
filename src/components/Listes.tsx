import { Plus, Search, Bell, Eye, Edit2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import AddListModal from './AddListModal';
import ViewListLeadsModal from './ViewListLeadsModal';
import { mockUsers } from '../data/mockUsers';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
}

interface ListData {
  id: number;
  name: string;
  lead_count: number;
  type: string;
  managers: string[];
  users: string[];
  leads: Lead[];
}

const mockLeads: Lead[] = [
  { id: '1', name: 'Dr. Jean Dupont', email: 'j.dupont@medical.fr', phone: '0601020304', status: 'nouveau' },
  { id: '2', name: 'Dr. Marie Leclerc', email: 'm.leclerc@hopital.fr', phone: '0602030405', status: 'contacté' },
  { id: '3', name: 'Dr. Paul Martin', email: 'p.martin@clinique.fr', phone: '0603040506', status: 'nouveau' },
];

const initialMockLists: ListData[] = [
  {
    id: 1,
    name: 'Professions médicales',
    lead_count: 1850,
    type: 'Importés',
    managers: ['Benjamin Zaoui', 'Daniel Blatche', 'Eytan Cauvy'],
    leads: mockLeads,
    users: [
      'Johanna Azuelos', 'Kamil Ziri', '+13'
    ],
  },
  {
    id: 2,
    name: 'Particuliers',
    lead_count: 317165,
    type: 'Importés',
    managers: [],
    leads: [],
    users: [
      'Julian Colmagro', 'Julie Tobel', 'Julien Audebert', '+13'
    ],
  },
];

interface ListesProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Listes({ onNotificationClick, notificationCount }: ListesProps) {
  const [mockLists, setMockLists] = useState<ListData[]>(initialMockLists);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ListData | null>(null);
  const [editingList, setEditingList] = useState<ListData | null>(null);

  const handleViewList = (list: ListData) => {
    setSelectedList(list);
    setShowViewModal(true);
  };

  const handleEditList = (list: ListData) => {
    setEditingList(list);
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setEditingList(null);
    setShowAddModal(true);
  };

  const handleSaveList = (listId: string, users: string[], managers: string[]) => {
    setMockLists(prevLists =>
      prevLists.map(list =>
        list.id.toString() === listId
          ? {
              ...list,
              users: users.map(userId => {
                const user = mockUsers.find(u => u.id === userId);
                return user ? `${user.first_name} ${user.last_name}` : '';
              }).filter(Boolean),
              managers: managers.map(managerId => {
                const manager = mockUsers.find(u => u.id === managerId);
                return manager ? `${manager.first_name} ${manager.last_name}` : '';
              }).filter(Boolean)
            }
          : list
      )
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Listes</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gérer les listes de leads et leurs accès</p>
        </div>
        <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative">
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
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une liste..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>
              <button
                onClick={handleAddNew}
                className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs md:text-sm font-light hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-md transition-all hover:scale-105 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Ajouter une liste
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {mockLists.map((list) => (
                <div key={list.id} className="glass-card p-6 floating-shadow hover:bg-white transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-sm font-light shadow-md flex-shrink-0">
                        {list.id}
                      </span>
                      <div>
                        <p className="text-base font-light text-gray-900">{list.name}</p>
                        <p className="text-xs text-gray-500 font-light">{list.lead_count.toLocaleString()} leads</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleViewList(list)}
                        className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Voir les leads"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditList(list)}
                        className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Éditer la liste"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-light bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200">
                        {list.type}
                      </span>
                    </div>

                    {(list.managers.length > 0 || list.users.length > 0) && (
                      <div>
                        <p className="text-xs text-gray-600 font-light mb-2">Utilisateurs avec accès</p>
                        <div className="flex flex-wrap gap-1.5">
                          {list.managers.slice(0, 3).map((manager, idx) => (
                            <span key={`m-${idx}`} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200/50 font-light">
                              {manager}
                            </span>
                          ))}
                          {list.users.filter(u => !u.startsWith('+')).slice(0, Math.max(0, 3 - list.managers.length)).map((user, idx) => (
                            <span key={`u-${idx}`} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200/50 font-light">
                              {user}
                            </span>
                          ))}
                          {(() => {
                            const realUsers = list.users.filter(u => !u.startsWith('+'));
                            const total = list.managers.length + realUsers.length;
                            const displayed = Math.min(3, list.managers.length) + Math.min(realUsers.length, Math.max(0, 3 - list.managers.length));
                            return total > displayed && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 font-light">
                                +{total - displayed}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
            <table className="w-full">
              <thead className="bg-white backdrop-blur-sm border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Nombre de leads</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Managers</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Utilisateurs avec accès</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30">
                {mockLists.map((list) => (
                  <tr key={list.id} className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-sm font-light shadow-md">
                        {list.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-900">{list.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-900">
                      {list.lead_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-light bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200">
                        {list.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-light text-gray-500">
                      {list.managers.length === 0 ? '-' : list.managers.join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {list.users.slice(0, 6).map((user, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200/50 font-light">
                            {user}
                          </span>
                        ))}
                        {list.users.length > 6 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 font-light">
                            +{list.users.length - 6}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700 font-light">
              Affichage de <span className="font-normal">1</span> à <span className="font-normal">{mockLists.length}</span> sur{' '}
              <span className="font-normal">{mockLists.length}</span> résultats
            </p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddListModal
          onClose={() => {
            setShowAddModal(false);
            setEditingList(null);
          }}
          onSave={handleSaveList}
          list={editingList ? {
            id: editingList.id.toString(),
            name: editingList.name,
            type: editingList.type,
            leads: editingList.leads,
            users: editingList.users,
            managers: editingList.managers
          } : undefined}
          availableUsers={mockUsers}
        />
      )}

      {showViewModal && selectedList && (
        <ViewListLeadsModal
          onClose={() => {
            setShowViewModal(false);
            setSelectedList(null);
          }}
          listName={selectedList.name}
          leads={selectedList.leads}
        />
      )}
    </div>
  );
}
