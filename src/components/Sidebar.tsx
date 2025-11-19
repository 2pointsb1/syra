import { useState, useEffect } from 'react';
import {
  Home,
  Target,
  Calendar,
  Users,
  List,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogOut,
  Menu,
  X,
  Handshake,
  ClipboardCheck,
  Building2,
  Send,
  RefreshCw,
  Calculator,
  BookOpen,
  FileText,
} from 'lucide-react';
import ProfileSwitcher from './ProfileSwitcher';
import ThemeToggle from './ThemeToggle';
import { UserProfile, getActiveProfile, getProfilePermissions, getProfileBadgeColor } from '../services/profileService';
import { getOrganizationSettings } from '../services/organizationSettingsService';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onCollapseChange: (collapsed: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, onCollapseChange, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [mainLogoUrl, setMainLogoUrl] = useState<string | null>(null);
  const [collapsedLogoUrl, setCollapsedLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadActiveProfile();
    loadLogos();
  }, []);

  const loadActiveProfile = async () => {
    try {
      const profile = await getActiveProfile();
      setCurrentProfile(profile);
    } catch (err) {
      console.error('Error loading active profile:', err);
    }
  };

  const loadLogos = async () => {
    try {
      const settings = await getOrganizationSettings();
      if (settings) {
        setMainLogoUrl(settings.main_logo_url);
        setCollapsedLogoUrl(settings.collapsed_logo_url);
      }
    } catch (err) {
      console.error('Error loading logos:', err);
    }
  };

  const handleProfileChange = (profile: UserProfile) => {
    setCurrentProfile(profile);
  };

  const permissions = currentProfile ? getProfilePermissions(currentProfile.profile_type) : null;
  const shouldShowManagement = permissions?.canAccessManagement ?? true;
  const shouldShowDashboard = permissions?.canAccessDashboard ?? true;
  const shouldShowLeads = permissions?.canAccessLeads ?? true;
  const shouldShowClients = permissions?.canAccessClients ?? true;
  const shouldShowAppointments = permissions?.canAccessAppointments ?? true;
  const shouldShowLibrary = permissions?.canAccessLibrary ?? false;
  const isIndicateurAffaires = currentProfile?.profile_type === 'Indicateur d\'affaires';
  const isMarketing = currentProfile?.profile_type === 'Marketing';

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

  const handleMobileNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const mainMenuItems = shouldShowDashboard ? [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
  ] : [];

  const appointmentItems = [
    ...(shouldShowLeads ? [{ id: 'leads', label: 'Leads', icon: Target }] : []),
    ...(shouldShowAppointments ? [{ id: 'calendrier', label: 'Agenda', icon: Calendar }] : []),
  ];

  const meetingItems = shouldShowAppointments && !isIndicateurAffaires && !isMarketing ? [
    { id: 'partenaires', label: 'Partenaires', icon: Handshake },
    { id: 'mise-en-relation', label: 'Mise en relation', icon: Send },
    { id: 'simulation-per', label: 'Simulation PER', icon: Calculator },
    { id: 'devoir-conseil', label: 'Devoir de conseil', icon: ClipboardCheck },
  ] : [];

  const clientItems = shouldShowClients ? [
    { id: 'client', label: 'Clients', icon: Building2 },
  ] : [];

  const libraryItems = shouldShowLibrary ? [
    { id: 'bibliotheque-contrats', label: 'Contrats', icon: FileText },
    { id: 'bibliotheque-bienviyance', label: 'Bienviyance', icon: BookOpen },
  ] : [];

  const managementItems = [
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'listes', label: 'Listes', icon: List },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
  ];

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-6 left-4 z-[9999] p-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 hover:bg-white transition-all"
          style={{ position: 'fixed' }}
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-900/95 dark:to-gray-950/95 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 border-r border-gray-200/50 dark:border-gray-700/50 z-40 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="p-6 relative">
        <div className="flex items-center justify-center mb-6 relative">
          <img
            src={isCollapsed ? (collapsedLogoUrl || "/Bienvisport-logo-b.png") : (mainLogoUrl || "/Bienviyance-logo-2.png")}
            alt="Bienviyance"
            className={`${isCollapsed ? 'h-10' : 'h-8'} object-contain transition-all duration-300`}
          />
          <button
            onClick={handleCollapseToggle}
            className={`hidden lg:block absolute ${isCollapsed ? 'right-[-2.5rem]' : 'right-[-2.5rem]'} top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-all shadow-md border border-gray-200/50 dark:border-gray-700/50 z-10`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="w-full p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 shadow-md">
                  <img
                    src={currentProfile?.photo_url || "/Retouched Azran Moche 2.jpeg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-light text-gray-900 dark:text-gray-100 truncate">
                    {currentProfile ? `${currentProfile.first_name} ${currentProfile.last_name}` : 'Moche Azran'}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-light ${currentProfile ? getProfileBadgeColor(currentProfile.profile_type) : 'bg-blue-100 text-blue-700'}`}>
                    {currentProfile?.profile_type || 'Manager'}
                  </span>
                </div>
                {isAccountMenuOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isAccountMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-gray-200/30 dark:border-gray-700/30 px-4 py-3 space-y-2">
                <button
                  onClick={() => {
                    setShowProfileSwitcher(true);
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-light"
                >
                  <RefreshCw className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>Changer de profil</span>
                </button>
                <button
                  onClick={() => {
                    handleMobileNavigate('parametres');
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-light"
                >
                  <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>Paramètres</span>
                </button>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                  <ThemeToggle isCollapsed={true} />
                  <button
                    onClick={onLogout}
                    className="flex-1 flex items-center justify-center px-4 py-3 text-sm rounded-2xl transition-all text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 font-light"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {mainMenuItems.length > 0 && (
          <>
            <div className="space-y-1 mb-4">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                      isActive
                        ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
            {!isCollapsed && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}
          </>
        )}

        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Prise de rendez-vous
              </span>
            </div>
          )}
          <div className="space-y-1 mb-4">
            {appointmentItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                    isActive
                      ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {!isCollapsed && !isIndicateurAffaires && !isMarketing && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}

        {meetingItems.length > 0 && (
          <>
            <div>
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Rendez-vous
                  </span>
                </div>
              )}
              <div className="space-y-1 mb-4">
                {meetingItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                        isActive
                          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {!isCollapsed && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}
          </>
        )}

        {clientItems.length > 0 && (
          <>
            <div>
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Suivi client
                  </span>
                </div>
              )}
              <div className="space-y-1 mb-4">
                {clientItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                        isActive
                          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {!isCollapsed && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}
          </>
        )}

        {libraryItems.length > 0 && (
          <>
            <div>
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Bibliothèque
                  </span>
                </div>
              )}
              <div className="space-y-1 mb-4">
                {libraryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                        isActive
                          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {!isCollapsed && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}
          </>
        )}

        {shouldShowManagement && (
          <>
            {!isCollapsed && <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-4"></div>}

            <div>
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-light text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Management
                  </span>
                </div>
              )}
              <div className="space-y-1">
                {managementItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all ${
                        isActive
                          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-md font-light'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-light">
            Développé par <span className="text-blue-500 dark:text-blue-400 font-normal">SYRA.io</span>
          </p>
        </div>
      )}
      </div>

      {showProfileSwitcher && (
        <ProfileSwitcher
          onClose={() => setShowProfileSwitcher(false)}
          onProfileChange={handleProfileChange}
          currentProfile={currentProfile}
        />
      )}
    </>
  );
}
