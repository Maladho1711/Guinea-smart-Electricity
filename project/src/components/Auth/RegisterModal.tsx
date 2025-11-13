import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, X, Users, Building2, Wrench, BarChart3, Globe, UserPlus, Mail, Phone, MapPin, Key, Lock, Building, Briefcase, Shield, Zap, Hash, User, CreditCard } from 'lucide-react';
import logoImage from "../../assets/guineaSmart.jpg";

interface RegisterModalProps {
  profileId: string;
  role: 'client' | 'technicien' | 'manager';
  profileTitle: string;
  onClose: () => void;
  onBack: () => void;
}

export function RegisterModal({ profileId, role, profileTitle, onClose, onBack }: RegisterModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [department, setDepartment] = useState('');
  const [sector, setSector] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [interventionZone, setInterventionZone] = useState('');
  const [ministry, setMinistry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // Définir les variables de profil AVANT handleSubmit
  const isCitoyen = profileId === 'citoyen';
  const isPME = profileId === 'pme';
  const isTechnicien = profileId === 'technicien';
  const isManager = profileId === 'manager';
  const isEtat = profileId === 'etat';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Générer email et password si nécessaire
      let userEmail = email;
      let userPassword = password;

      // Pour les citoyens, email et password sont maintenant OBLIGATOIRES
      if (profileId === 'citoyen') {
        if (!email || !password) {
          setError('Veuillez remplir votre email et mot de passe pour créer votre compte.');
          setLoading(false);
          return;
        }
        // Utiliser l'email et password fournis par l'utilisateur
        userEmail = email;
        userPassword = password;
      } else if (!email || !password) {
        setError('Veuillez remplir tous les champs requis.');
        setLoading(false);
        return;
      }

      // Vérifier la confirmation du mot de passe pour Manager et État
      if ((isManager || isEtat) && password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        setLoading(false);
        return;
      }

      // Utiliser le nom du responsable pour PME, nom/prénom pour technicien, manager et état, sinon le nom complet
      let displayName = fullName;
      if (isPME) {
        displayName = responsibleName;
      } else if (isTechnicien || isManager || isEtat) {
        displayName = `${firstName} ${lastName}`.trim();
      }
      
      // Mapper profileId vers le rôle pour l'API
      let userRole: 'client' | 'technicien' | 'manager' | 'pme' | 'etat' = 'client';
      if (isCitoyen) {
        userRole = 'client';
      } else if (isPME) {
        userRole = 'pme';
      } else if (isTechnicien) {
        userRole = 'technicien';
      } else if (isManager) {
        userRole = 'manager';
      } else if (isEtat) {
        userRole = 'etat';
      }
      
      // Préparer toutes les données pour l'inscription
      await signUp({
        email: userEmail,
        password: userPassword,
        role: userRole,
        fullName: displayName,
        firstName: isTechnicien || isManager || isEtat ? firstName : undefined,
        lastName: isTechnicien || isManager || isEtat ? lastName : undefined,
        phone: phone || undefined,
        address: address || undefined,
        meterNumber: isCitoyen ? meterNumber : undefined,
        companyName: isPME ? companyName : undefined,
        responsibleName: isPME ? responsibleName : undefined,
        matricule: isTechnicien ? matricule : undefined,
        department: (isTechnicien || isManager || isEtat) ? department : undefined,
        sector: isTechnicien ? sector : undefined,
        interventionZone: isTechnicien ? interventionZone : undefined,
        ministry: isEtat ? ministry : undefined,
      });
      
      // Rediriger selon le profil après inscription réussie
      onClose();
      
      // Attendre un peu pour que le contexte se mette à jour
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isCitoyen) {
        // Pour les citoyens, rediriger vers la page d'accueil qui affichera le dashboard
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else if (isPME) {
        navigate('/pme-dashboard');
      } else if (isTechnicien) {
        navigate('/technician-dashboard');
      } else if (isManager) {
        navigate('/manager-dashboard');
      } else if (isEtat) {
        navigate('/etat-dashboard');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      
      // Afficher le message d'erreur spécifique du backend
      let errorMsg = error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
      
      // Si c'est une erreur de validation, afficher les détails
      if (error.message?.includes('validation') || error.message?.includes('Email') || error.message?.includes('mot de passe')) {
        errorMsg = error.message;
      } else if (error.message?.includes('serveur backend')) {
        errorMsg = error.message;
      } else if (error.message?.includes('existe déjà')) {
        // Message amélioré pour les comptes existants
        errorMsg = error.message;
      } else if (error.message?.includes('déjà utilisés')) {
        // Message pour les rôles déjà utilisés
        errorMsg = error.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Icônes pour chaque profil
  const getProfileIcon = () => {
    if (isCitoyen) return Users;
    if (isPME) return Building2;
    if (isTechnicien) return Wrench;
    if (isManager) return BarChart3;
    if (isEtat) return Globe;
    return UserPlus;
  };

  const ProfileIcon = getProfileIcon();
  
  // Couleurs pour chaque profil
  const getProfileColors = () => {
    if (isCitoyen) return { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' };
    if (isPME) return { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' };
    if (isTechnicien) return { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' };
    if (isManager) return { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' };
    if (isEtat) return { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' };
    return { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-200' };
  };

  const colors = getProfileColors();

  // Empêcher le scroll de l'arrière-plan
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay vert */}
      <div
        className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Carte modale */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          {isCitoyen || isPME || isTechnicien || isManager || isEtat ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
                <p className="text-sm text-gray-600 mt-1">{profileTitle}</p>
              </div>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Formulaire dans une carte */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
            <form onSubmit={handleSubmit} className={`p-6 ${isCitoyen || isPME ? 'space-y-5' : 'space-y-4'}`}>
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src={logoImage}
                  alt="Guinea Smart Electricity Logo"
                  className="h-12 object-contain"
                />
              </div>
              {/* Icône du profil centrée en haut */}
              <div className="flex justify-center mb-4">
                <div className={`relative ${colors.bg} ${colors.border} border-2 rounded-full p-3 shadow-lg`}>
                  <ProfileIcon className={`w-10 h-10 ${colors.icon}`} strokeWidth={2} />
                  <div className={`absolute -bottom-1 -right-1 ${colors.bg} ${colors.border} border-2 rounded-full p-1`}>
                    <UserPlus className={`w-3.5 h-3.5 ${colors.icon}`} />
                  </div>
                </div>
              </div>

          {/* En-tête spécifique pour Citoyen */}
          {isCitoyen && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription</h2>
              <p className="text-gray-600">Enregistrez votre compteur</p>
            </div>
          )}

          {/* En-tête spécifique pour PME */}
          {isPME && (
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription PME</h2>
              <p className="text-gray-600">Enregistrez votre entreprise</p>
            </div>
          )}

          {/* En-tête spécifique pour Technicien */}
          {isTechnicien && (
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription Technicien EDG</h2>
              <p className="text-gray-600">Créez votre compte technicien</p>
            </div>
          )}

          {/* En-tête spécifique pour Manager */}
          {isManager && (
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription Manager</h2>
              <p className="text-gray-600">Créez votre compte de gestion EDG</p>
            </div>
          )}

          {/* En-tête spécifique pour État */}
          {isEtat && (
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription État</h2>
              <p className="text-gray-600">Créez votre compte institutionnel</p>
            </div>
          )}

          {/* Nom de l'entreprise (PME uniquement) */}
          {isPME && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Entreprise SARL"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Secteur d'activité (PME uniquement) */}
          {isPME && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                Secteur d'activité
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Commerce, Industrie, Services..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Numéro de compteur (Citoyen et PME) */}
          {(isCitoyen || isPME) && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-500" />
                {isPME ? 'Numéro de compteur professionnel' : 'Numéro de compteur'}
              </label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder={isPME ? "PRO-XXXXXXXXXX" : "Ex: GSE-12345678"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Matricule (Technicien uniquement) */}
          {isTechnicien && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                Matricule EDG
              </label>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="TECH-XXXXXXXXXX"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Nom et Prénom séparés pour Technicien, Manager et État */}
          {(isTechnicien || isManager || isEtat) ? (
            <>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={isManager ? "Sidibé" : (isEtat ? "Doré" : "Nom")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isManager ? "Mamadou Aliou" : (isEtat ? "Mamy" : "Prénom")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                  required
                />
              </div>
            </>
          ) : (
            /* Nom complet / Nom du responsable pour les autres */
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                {isPME ? 'Nom du responsable' : 'Nom complet'}
              </label>
              <input
                type="text"
                value={isPME ? responsibleName : fullName}
                onChange={(e) => isPME ? setResponsibleName(e.target.value) : setFullName(e.target.value)}
                placeholder={isPME ? "Prénom Nom" : (isCitoyen ? "Votre nom" : "Votre nom complet")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Email (tous les profils) */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              {isCitoyen ? 'Email' : (isPME || isTechnicien || isManager ? 'Email professionnel' : (isEtat ? 'Email officiel' : 'Email'))}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isCitoyen ? "votre.email@exemple.com" : (isPME ? "contact@entreprise.gn" : (isTechnicien ? "technicien@edg.gn" : (isManager ? "prenom.nom@edg.gn" : (isEtat ? "prenom.nom@energie.gov.gn" : "votre.email@exemple.com"))))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
              required
            />
          </div>

          {/* Ministère/Service (État uniquement) */}
          {isEtat && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                Ministère/Service
              </label>
              <input
                type="text"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                placeholder="Ministère de l'Énergie"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Téléphone (avant mot de passe pour Manager, pas pour État, après pour les autres) */}
          {isManager ? (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+224 XXX XX XX XX"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          ) : !isEtat ? (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isPME || isTechnicien ? "+224 XXX XX XX XX" : "+224 6XX XXX XXX"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          ) : null}

          {/* Mot de passe (tous les profils) */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={(isManager || isEtat) ? "••••••••" : "Minimum 8 caractères"}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
              required
              minLength={8}
            />
            {isCitoyen && (
              <p className="text-xs text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule et un chiffre
              </p>
            )}
          </div>

          {/* Confirmer le mot de passe (Manager et État) */}
          {(isManager || isEtat) && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-500" />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
                minLength={6}
              />
            </div>
          )}

          {/* Zone d'intervention (Technicien uniquement) */}
          {isTechnicien && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Zone d'intervention
              </label>
              <input
                type="text"
                value={interventionZone}
                onChange={(e) => setInterventionZone(e.target.value)}
                placeholder="Ex: Kaloum"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {/* Adresse (Citoyen et PME uniquement, pas pour État) */}
          {(isCitoyen || isPME) && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Adresse
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isPME ? "Quartier, Commune" : "Votre adresse"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {error}
            </div>
          )}

          {isCitoyen || isPME || isTechnicien || isManager || isEtat ? (
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Inscription...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
              {(isPME || isTechnicien || isManager || isEtat) && (
                <>
                  <p className="text-center text-gray-600 text-sm">
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        // Naviguer vers la connexion - vous devrez peut-être ajuster cela selon votre logique
                      }}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

