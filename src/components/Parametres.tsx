import { useState, useEffect, useRef } from 'react';
import { User, Mail, Camera, Bell, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, Image, Upload } from 'lucide-react';
import { getGoogleSyncStatus, createGoogleSyncRecord, initiateGoogleOAuth, disconnectGoogleSync, GoogleSyncStatus } from '../services/googleSyncService';
import { getActiveProfile, getProfilePermissions, UserProfile } from '../services/profileService';
import { getOrganizationSettings, uploadMainLogo, uploadCollapsedLogo, uploadMainLogoDark, uploadCollapsedLogoDark } from '../services/organizationSettingsService';

interface ParametresProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Parametres({ onNotificationClick, notificationCount }: ParametresProps) {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    photoUrl: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [googleSync, setGoogleSync] = useState<GoogleSyncStatus | null>(null);
  const [isSyncLoading, setIsSyncLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [canManageSettings, setCanManageSettings] = useState(false);
  const [mainLogoUrl, setMainLogoUrl] = useState<string | null>(null);
  const [collapsedLogoUrl, setCollapsedLogoUrl] = useState<string | null>(null);
  const [mainLogoDarkUrl, setMainLogoDarkUrl] = useState<string | null>(null);
  const [collapsedLogoDarkUrl, setCollapsedLogoDarkUrl] = useState<string | null>(null);
  const [isUploadingMainLogo, setIsUploadingMainLogo] = useState(false);
  const [isUploadingCollapsedLogo, setIsUploadingCollapsedLogo] = useState(false);
  const [isUploadingMainLogoDark, setIsUploadingMainLogoDark] = useState(false);
  const [isUploadingCollapsedLogoDark, setIsUploadingCollapsedLogoDark] = useState(false);
  const [logoSuccessMessage, setLogoSuccessMessage] = useState('');
  const [logoErrorMessage, setLogoErrorMessage] = useState('');
  const mainLogoInputRef = useRef<HTMLInputElement>(null);
  const collapsedLogoInputRef = useRef<HTMLInputElement>(null);
  const mainLogoDarkInputRef = useRef<HTMLInputElement>(null);
  const collapsedLogoDarkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGoogleSyncStatus();
    loadProfile();
    loadLogos();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getActiveProfile();
      setCurrentProfile(profile);
      if (profile) {
        const permissions = getProfilePermissions(profile.profile_type);
        setCanManageSettings(permissions.canManageLogos);
        setProfileData({
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          photoUrl: profile.photo_url
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setCanManageSettings(false);
    }
  };

  const loadLogos = async () => {
    try {
      const settings = await getOrganizationSettings();
      if (settings) {
        setMainLogoUrl(settings.main_logo_url);
        setCollapsedLogoUrl(settings.collapsed_logo_url);
        setMainLogoDarkUrl(settings.main_logo_dark_url);
        setCollapsedLogoDarkUrl(settings.collapsed_logo_dark_url);
      }
    } catch (err) {
      console.error('Error loading logos:', err);
    }
  };

  const loadGoogleSyncStatus = async () => {
    try {
      setIsSyncLoading(true);
      setSyncError('');
      const status = await getGoogleSyncStatus('mock-user-id');
      setGoogleSync(status);
    } catch (err) {
      setSyncError('Erreur lors du chargement du statut de synchronisation');
    } finally {
      setIsSyncLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    initiateGoogleOAuth();
  };

  const handleDisconnectGoogle = async () => {
    if (!googleSync) return;

    try {
      setSyncError('');
      await disconnectGoogleSync(googleSync.id);
      await loadGoogleSyncStatus();
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
    }
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Tous les champs sont requis.');
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    console.log('Changing password');
    setPasswordSuccess(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleMainLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoErrorMessage('Seuls les fichiers image sont autorisés');
      return;
    }

    try {
      setIsUploadingMainLogo(true);
      setLogoErrorMessage('');
      setLogoSuccessMessage('');
      const url = await uploadMainLogo(file);
      setMainLogoUrl(url);
      setLogoSuccessMessage('Logo principal mis à jour avec succès');
      setTimeout(() => setLogoSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setLogoErrorMessage(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploadingMainLogo(false);
    }
  };

  const handleCollapsedLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoErrorMessage('Seuls les fichiers image sont autorisés');
      return;
    }

    try {
      setIsUploadingCollapsedLogo(true);
      setLogoErrorMessage('');
      setLogoSuccessMessage('');
      const url = await uploadCollapsedLogo(file);
      setCollapsedLogoUrl(url);
      setLogoSuccessMessage('Logo réduit mis à jour avec succès');
      setTimeout(() => setLogoSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setLogoErrorMessage(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploadingCollapsedLogo(false);
    }
  };

  const handleMainLogoDarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoErrorMessage('Seuls les fichiers image sont autorisés');
      return;
    }

    try {
      setIsUploadingMainLogoDark(true);
      setLogoErrorMessage('');
      setLogoSuccessMessage('');
      const url = await uploadMainLogoDark(file);
      setMainLogoDarkUrl(url);
      setLogoSuccessMessage('Logo dark mode principal mis à jour avec succès');
      setTimeout(() => setLogoSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setLogoErrorMessage(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploadingMainLogoDark(false);
    }
  };

  const handleCollapsedLogoDarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoErrorMessage('Seuls les fichiers image sont autorisés');
      return;
    }

    try {
      setIsUploadingCollapsedLogoDark(true);
      setLogoErrorMessage('');
      setLogoSuccessMessage('');
      const url = await uploadCollapsedLogoDark(file);
      setCollapsedLogoDarkUrl(url);
      setLogoSuccessMessage('Logo dark mode réduit mis à jour avec succès');
      setTimeout(() => setLogoSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setLogoErrorMessage(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploadingCollapsedLogoDark(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Paramètres du compte</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gérez les informations de votre profil</p>
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
        <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 shadow-xl">
                  <img
                    src={profileData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-110 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3 font-light">JPG, PNG max 5MB</p>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                      placeholder="Prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                      placeholder="Nom"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs md:text-sm font-light hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:scale-105"
                >
                  Enregistrer
                </button>
                <button className="w-full sm:w-auto px-6 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-xs md:text-sm font-light hover:bg-white transition-all">
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow mt-6">
            <h2 className="text-lg md:text-xl font-light text-gray-900 mb-6">Modifier le mot de passe</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-light text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light transition-all"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-light">
                Minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
              </p>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-xs text-red-600 font-light">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-xs text-green-600 font-light">Votre mot de passe a été modifié avec succès.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handlePasswordChange}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs md:text-sm font-light hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:scale-105"
                >
                  Modifier le mot de passe
                </button>
                <button
                  onClick={() => {
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess(false);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-xs md:text-sm font-light hover:bg-white transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow mt-6">
            <h2 className="text-lg md:text-xl font-light text-gray-900 mb-6">Synchronisation Google</h2>

            <div className="space-y-6">
              <p className="text-sm text-gray-600 font-light">
                Synchronisez votre compte Google pour connecter votre Gmail et votre Google Agenda avec l'application.
              </p>

              {syncError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-xs text-red-600 font-light">{syncError}</p>
                </div>
              )}

              {isSyncLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-light text-gray-900">Gmail</span>
                      </div>
                      {googleSync?.gmail_connected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-light text-green-700">Connecté</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-xs font-light text-red-700">Non connecté</span>
                        </div>
                      )}
                    </div>
                    {googleSync?.gmail_connected && googleSync.gmail_email && (
                      <p className="text-xs text-gray-500 font-light ml-8">{googleSync.gmail_email}</p>
                    )}
                  </div>

                  <div className="glass-card p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-light text-gray-900">Google Agenda</span>
                      </div>
                      {googleSync?.calendar_connected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-light text-green-700">Connecté</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-xs font-light text-red-700">Non connecté</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {googleSync?.last_sync_at && (
                    <div className="text-xs text-gray-500 font-light">
                      Dernière synchronisation : {new Date(googleSync.last_sync_at).toLocaleString('fr-FR')}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {googleSync?.gmail_connected || googleSync?.calendar_connected ? (
                      <button
                        onClick={handleDisconnectGoogle}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs md:text-sm font-light transition-all shadow-md"
                      >
                        Déconnecter Google
                      </button>
                    ) : (
                      <button
                        onClick={handleConnectGoogle}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs md:text-sm font-light hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:scale-105"
                      >
                        Synchroniser avec Google
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {canManageSettings && (
            <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow mt-6">
              <h2 className="text-lg md:text-xl font-light text-gray-900 dark:text-gray-100 mb-6">Personnalisation du CRM</h2>

              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                  Personnalisez les logos du CRM pour tous les utilisateurs de l'organisation.
                </p>

                {logoSuccessMessage && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                    <p className="text-sm text-green-700 dark:text-green-300 font-light">{logoSuccessMessage}</p>
                  </div>
                )}

                {logoErrorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                    <p className="text-sm text-red-700 dark:text-red-300 font-light">{logoErrorMessage}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Logo principal (sidebar étendue)
                    </label>
                    <div className="glass-card p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center h-32 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                        {mainLogoUrl ? (
                          <img src={mainLogoUrl} alt="Logo principal" className="max-h-24 object-contain" />
                        ) : (
                          <img src="/Bienviyance-logo-2.png" alt="Logo par défaut" className="max-h-24 object-contain" />
                        )}
                      </div>
                      <button
                        onClick={() => mainLogoInputRef.current?.click()}
                        disabled={isUploadingMainLogo}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl text-sm font-light text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isUploadingMainLogo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Modifier le logo
                          </>
                        )}
                      </button>
                      <input
                        ref={mainLogoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleMainLogoUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2 text-center">
                        PNG, JPG, SVG - Max 2MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Logo réduit (sidebar rétractée)
                    </label>
                    <div className="glass-card p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center h-32 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                        {collapsedLogoUrl ? (
                          <img src={collapsedLogoUrl} alt="Logo réduit" className="max-h-20 object-contain" />
                        ) : (
                          <img src="/Bienvisport-logo-b.png" alt="Logo par défaut" className="max-h-20 object-contain" />
                        )}
                      </div>
                      <button
                        onClick={() => collapsedLogoInputRef.current?.click()}
                        disabled={isUploadingCollapsedLogo}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl text-sm font-light text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isUploadingCollapsedLogo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Modifier le logo
                          </>
                        )}
                      </button>
                      <input
                        ref={collapsedLogoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCollapsedLogoUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 font-light mt-2 text-center">
                        PNG, JPG, SVG - Max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">Logos mode sombre</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-6">
                    Personnalisez les logos qui s'affichent lorsque le thème sombre est activé.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Logo principal dark mode (sidebar étendue)
                      </label>
                      <div className="glass-card p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center h-32 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                          {mainLogoDarkUrl ? (
                            <img src={mainLogoDarkUrl} alt="Logo principal dark mode" className="max-h-24 object-contain" />
                          ) : (
                            <img src="/Bienviyance-logo-7.png" alt="Logo dark mode par défaut" className="max-h-24 object-contain" />
                          )}
                        </div>
                        <button
                          onClick={() => mainLogoDarkInputRef.current?.click()}
                          disabled={isUploadingMainLogoDark}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl text-sm font-light text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isUploadingMainLogoDark ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Modifier le logo dark mode
                            </>
                          )}
                        </button>
                        <input
                          ref={mainLogoDarkInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMainLogoDarkUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2 text-center">
                          PNG, JPG, SVG - Max 2MB
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Logo réduit dark mode (sidebar rétractée)
                      </label>
                      <div className="glass-card p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center h-32 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                          {collapsedLogoDarkUrl ? (
                            <img src={collapsedLogoDarkUrl} alt="Logo réduit dark mode" className="max-h-20 object-contain" />
                          ) : (
                            <img src="/Bienviyance-logo-7.png" alt="Logo dark mode par défaut" className="max-h-20 object-contain" />
                          )}
                        </div>
                        <button
                          onClick={() => collapsedLogoDarkInputRef.current?.click()}
                          disabled={isUploadingCollapsedLogoDark}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl text-sm font-light text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isUploadingCollapsedLogoDark ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Modifier le logo dark mode
                            </>
                          )}
                        </button>
                        <input
                          ref={collapsedLogoDarkInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCollapsedLogoDarkUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2 text-center">
                          PNG, JPG, SVG - Max 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-light">
                    Les modifications seront visibles par tous les utilisateurs après rechargement de la page.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
