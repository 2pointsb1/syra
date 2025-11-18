import { Plus, Search, MoreHorizontal, X, Bell, UserPlus, Trash2, Edit2, FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import { User } from '../types';
import { uploadAdvisorBrochure, deleteAdvisorBrochure, getAdvisorBrochureUrl, updateUserBrochure } from '../services/advisorBrochureService';

const mockUsers: User[] = [
  {
    id: '1',
    organization_id: '1',
    email: 'e.aboukrat@bnvce.fr',
    first_name: 'Ethan',
    last_name: 'Aboukrat',
    role: 'indicateur_affaires',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '2',
    organization_id: '1',
    email: 'd.alamihamdouni@bnvce.fr',
    first_name: 'Driss',
    last_name: 'Alami hamdouni',
    role: 'indicateur_affaires',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '3',
    organization_id: '1',
    email: 'm.assouline@bnvce.fr',
    first_name: 'Maor',
    last_name: 'Assouline',
    role: 'indicateur_affaires',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '4',
    organization_id: '1',
    email: 's.atlan@bnvce.fr',
    first_name: 'Sacha',
    last_name: 'Atlan',
    role: 'signataire',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '5',
    organization_id: '1',
    email: 'o.attard@bnvce.fr',
    first_name: 'Ornella',
    last_name: 'Attard',
    role: 'indicateur_affaires',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '6',
    organization_id: '1',
    email: 'moche.azran@bnvce.fr',
    first_name: 'Moche',
    last_name: 'Azran',
    role: 'gestion',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

const availableLists = [
  'Particuliers',
  "Chefs d'entreprise",
  'Professions médicales',
  'Live PER',
  'Live PER Secondaire',
  'Live Assurance Vie',
  'Lead Assurance Vie Coreg',
];

const mockListAssignments: Record<string, string[]> = {
  '1': ['Particuliers', "Chefs d'entreprise"],
  '2': ['Particuliers', "Chefs d'entreprise"],
  '3': ["Chefs d'entreprise", 'Particuliers', 'Live PER', 'Particuliers', 'Live PER Secondaire', 'Live PER Secondaire', 'Live Assurance Vie', 'Lead Assurance Vie Coreg', 'Live PER'],
  '4': ["Chefs d'entreprise", 'Particuliers'],
  '5': ["Chefs d'entreprise", 'Particuliers', 'Professions médicales', 'Live PER Secondaire', 'Live Assurance Vie'],
  '6': ['Particuliers', "Chefs d'entreprise", 'Professions médicales'],
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const avatarColors = [
  'from-blue-400 to-violet-500',
  'from-violet-400 to-purple-500',
  'from-indigo-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
];

interface UtilisateursProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Utilisateurs({ onNotificationClick, notificationCount }: UtilisateursProps) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'gestion' as 'gestion' | 'signataire' | 'indicateur_affaires',
    assigned_lists: [] as string[],
  });
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'gestion' as 'gestion' | 'signataire' | 'indicateur_affaires',
    is_active: true,
    assigned_lists: [] as string[],
  });
  const [editBrochureFile, setEditBrochureFile] = useState<File | null>(null);
  const [existingBrochureUrl, setExistingBrochureUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let brochureFileName: string | null = null;

      if (formData.role === 'signataire' && brochureFile) {
        brochureFileName = await uploadAdvisorBrochure(brochureFile, 'temp-id');
      }

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);

      setShowModal(false);
      setFormData({ first_name: '', last_name: '', email: '', role: 'gestion', assigned_lists: [] });
      setBrochureFile(null);
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      role: user.role as 'gestion' | 'signataire' | 'indicateur_affaires',
      is_active: user.is_active,
      assigned_lists: mockListAssignments[user.id] || [],
    });
    setExistingBrochureUrl(user.advisor_brochure_url || null);
    setEditBrochureFile(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userToEdit && editFormData.role === 'signataire' && editBrochureFile) {
        if (existingBrochureUrl) {
          await deleteAdvisorBrochure(existingBrochureUrl);
        }
        const brochureFileName = await uploadAdvisorBrochure(editBrochureFile, userToEdit.id);
        await updateUserBrochure(userToEdit.id, brochureFileName);
      }

      setShowEditModal(false);
      setUserToEdit(null);
      setEditFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'gestion',
        is_active: true,
        assigned_lists: [],
      });
      setEditBrochureFile(null);
      setExistingBrochureUrl(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const toggleListInFormData = (list: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_lists: prev.assigned_lists.includes(list)
        ? prev.assigned_lists.filter(l => l !== list)
        : [...prev.assigned_lists, list]
    }));
  };

  const toggleListInEditFormData = (list: string) => {
    setEditFormData(prev => ({
      ...prev,
      assigned_lists: prev.assigned_lists.includes(list)
        ? prev.assigned_lists.filter(l => l !== list)
        : [...prev.assigned_lists, list]
    }));
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Utilisateurs</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gérer les utilisateurs et leurs accès</p>
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

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div className="glass-card floating-shadow overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex-shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-light">Ajouter un utilisateur</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="md:hidden w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-md transition-all hover:scale-105 flex-shrink-0"
                title="Ajouter un utilisateur"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mockUsers.map((user, index) => (
                <div key={user.id} className="glass-card p-6 floating-shadow hover:bg-white transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-light shadow-md flex-shrink-0`}>
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <div>
                        <p className="text-base font-light text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500 font-light">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {user.role === 'signataire' && user.advisor_brochure_url && (
                        <button
                          onClick={() => window.open(getAdvisorBrochureUrl(user.advisor_brochure_url!), '_blank')}
                          className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                          title="Voir la plaquette"
                        >
                          <FileText className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(user)}
                        className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Modifier l'utilisateur"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-200/50'
                        : user.role === 'manager'
                        ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200/50'
                        : user.role === 'gestion'
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50'
                        : user.role === 'signataire'
                        ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : user.role === 'gestion' ? 'Gestion' : user.role === 'signataire' ? 'Signataire' : 'Indicateur d\'affaires'}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                      user.is_active
                        ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 font-light mb-2">Listes assignées</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockListAssignments[user.id]?.slice(0, 3).map((list, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-white text-gray-700 border border-gray-200 font-light">
                          {list}
                        </span>
                      ))}
                      {mockListAssignments[user.id]?.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 font-light">
                          +{mockListAssignments[user.id].length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
            <table className="w-full">
              <thead className="bg-white backdrop-blur-sm border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Activité</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider">Listes assignées</th>
                  <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30">
                {mockUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-light shadow-md`}>
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900">{user.first_name} {user.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                        user.role === 'manager'
                          ? 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200/50'
                          : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : user.role === 'gestion' ? 'Gestion' : user.role === 'signataire' ? 'Signataire' : 'Indicateur d\'affaires'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                        user.is_active
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50'
                      }`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {mockListAssignments[user.id]?.slice(0, 3).map((list, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-white text-gray-700 border border-gray-200 font-light">
                            {list}
                          </span>
                        ))}
                        {mockListAssignments[user.id]?.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 font-light">
                            +{mockListAssignments[user.id].length - 3}
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
              Affichage de <span className="font-normal">1</span> à <span className="font-normal">{mockUsers.length}</span> sur{' '}
              <span className="font-normal">{mockUsers.length}</span> résultats
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white backdrop-blur-xl rounded-3xl shadow-2xl z-50 p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-light text-gray-900">Ajouter un utilisateur</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value as 'gestion' | 'signataire' | 'indicateur_affaires' });
                    setBrochureFile(null);
                  }}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  <option value="gestion">Gestion</option>
                  <option value="signataire">Signataire</option>
                  <option value="indicateur_affaires">Indicateur d'affaires</option>
                </select>
              </div>
              {formData.role === 'signataire' && (
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Plaquette signataire (PDF)</label>
                  <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                    {!brochureFile ? (
                      <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-xl p-4 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-light text-gray-600">Cliquez pour uploader un PDF</span>
                        <span className="text-xs font-light text-gray-500 mt-1">Maximum 10MB</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.type !== 'application/pdf') {
                                alert('Seuls les fichiers PDF sont autorisés');
                                return;
                              }
                              if (file.size > 10 * 1024 * 1024) {
                                alert('La taille du fichier ne doit pas dépasser 10MB');
                                return;
                              }
                              setBrochureFile(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-light text-gray-700">{brochureFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBrochureFile(null)}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Listes de leads assignées</label>
                <div className="border border-gray-200 rounded-2xl p-3 bg-white max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {availableLists.map((list) => (
                      <label key={list} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.assigned_lists.includes(list)}
                          onChange={() => toggleListInFormData(list)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400/50"
                        />
                        <span className="text-sm font-light text-gray-700">{list}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.assigned_lists.length > 0 && (
                  <p className="text-xs text-gray-500 font-light mt-2">
                    {formData.assigned_lists.length} liste{formData.assigned_lists.length > 1 ? 's' : ''} sélectionnée{formData.assigned_lists.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-2 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                >
                  Ajouter
                </button>
              </div>
              {showSuccessMessage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-sm font-light text-green-700 text-center">
                    Les informations de connexion ont été envoyées par mail au nouvel utilisateur
                  </p>
                </div>
              )}
            </form>
          </div>
        </>
      )}

      {showEditModal && userToEdit && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setShowEditModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white backdrop-blur-xl rounded-3xl shadow-2xl z-50 p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-light text-gray-900">Modifier l'utilisateur</h2>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={editFormData.first_name}
                  onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={editFormData.last_name}
                  onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Mot de passe
                  <span className="text-xs text-gray-500 ml-2">(laisser vide pour ne pas modifier)</span>
                </label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Rôle</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, role: e.target.value as 'gestion' | 'signataire' | 'indicateur_affaires' });
                    setEditBrochureFile(null);
                  }}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  <option value="gestion">Gestion</option>
                  <option value="signataire">Signataire</option>
                  <option value="indicateur_affaires">Indicateur d'affaires</option>
                </select>
              </div>
              {editFormData.role === 'signataire' && (
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Plaquette signataire (PDF)</label>
                  <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
                    {existingBrochureUrl && !editBrochureFile && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-light text-gray-700">Plaquette actuelle</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={getAdvisorBrochureUrl(existingBrochureUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-light text-blue-600 hover:text-blue-700 underline"
                          >
                            Télécharger
                          </a>
                          <button
                            type="button"
                            onClick={() => setExistingBrochureUrl(null)}
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}
                    {!editBrochureFile ? (
                      <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-xl p-4 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-light text-gray-600">
                          {existingBrochureUrl ? 'Remplacer le PDF' : 'Cliquez pour uploader un PDF'}
                        </span>
                        <span className="text-xs font-light text-gray-500 mt-1">Maximum 10MB</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.type !== 'application/pdf') {
                                alert('Seuls les fichiers PDF sont autorisés');
                                return;
                              }
                              if (file.size > 10 * 1024 * 1024) {
                                alert('La taille du fichier ne doit pas dépasser 10MB');
                                return;
                              }
                              setEditBrochureFile(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-light text-gray-700">{editBrochureFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditBrochureFile(null)}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.is_active}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400/50"
                  />
                  <span className="text-sm font-light text-gray-700">Utilisateur actif</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Listes de leads assignées</label>
                <div className="border border-gray-200 rounded-2xl p-3 bg-white max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {availableLists.map((list) => (
                      <label key={list} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                        <input
                          type="checkbox"
                          checked={editFormData.assigned_lists.includes(list)}
                          onChange={() => toggleListInEditFormData(list)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400/50"
                        />
                        <span className="text-sm font-light text-gray-700">{list}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {editFormData.assigned_lists.length > 0 && (
                  <p className="text-xs text-gray-500 font-light mt-2">
                    {editFormData.assigned_lists.length} liste{editFormData.assigned_lists.length > 1 ? 's' : ''} sélectionnée{editFormData.assigned_lists.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-5 py-2 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {showDeleteModal && userToDelete && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setShowDeleteModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white backdrop-blur-xl rounded-3xl shadow-2xl z-50 p-8 animate-fadeIn">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-2">Supprimer l'utilisateur ?</h2>
              <p className="text-sm text-gray-600 font-light">
                Êtes-vous sûr de vouloir supprimer <span className="font-normal text-gray-900">{userToDelete.first_name} {userToDelete.last_name}</span> ?
              </p>
              <p className="text-xs text-red-600 font-light mt-2">
                Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-5 py-2 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-light hover:from-red-600 hover:to-red-700 shadow-md transition-all hover:scale-105"
              >
                Supprimer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
