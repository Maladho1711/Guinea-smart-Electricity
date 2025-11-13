import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Building2, Wrench, BarChart3, Globe, LogOut } from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { LoginModal } from './LoginModal';

interface ProfileOption {
    id: string;
    role: 'client' | 'technicien' | 'manager';
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
}

interface ProfileSelectionProps {
    onClose: () => void;
    mode?: 'login' | 'register';
}

export function ProfileSelection({ onClose, mode }: ProfileSelectionProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProfile, setSelectedProfile] = useState<ProfileOption | null>(null);

    // Déterminer le mode depuis le prop ou l'URL
    const currentMode = mode || (location.search.includes('mode=register') ? 'register' : 'login');
    const isRegister = currentMode === 'register';
    const isLogin = !isRegister;

    const profiles: ProfileOption[] = [
        {
            id: 'citoyen',
            role: 'client',
            title: 'Citoyen',
            subtitle: 'Particulier résidentiel',
            icon: Users,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
        },
        {
            id: 'pme',
            role: 'client',
            title: 'PME',
            subtitle: 'Petite et moyenne entreprise',
            icon: Building2,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
        },
        {
            id: 'technicien',
            role: 'technicien',
            title: 'Technicien EDG',
            subtitle: 'Équipe technique terrain',
            icon: Wrench,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
        },
        {
            id: 'manager',
            role: 'manager',
            title: 'Manager EDG',
            subtitle: 'Gestion et supervision',
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
        },
        {
            id: 'etat',
            role: 'manager',
            title: 'État',
            subtitle: 'Institutions gouvernementales',
            icon: Globe,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
        },
    ];

    const handleProfileSelect = (profile: ProfileOption) => {
        // Stocker le rôle sélectionné dans sessionStorage pour l'utiliser dans le login/register
        sessionStorage.setItem('selectedRole', profile.role);
        sessionStorage.setItem('selectedProfileId', profile.id);

        if (isRegister) {
            // Afficher le formulaire d'inscription modal
            setSelectedProfile(profile);
        } else {
            // Pour la connexion, afficher le formulaire modal si citoyen, PME, technicien, manager ou etat
            if (profile.id === 'citoyen' || profile.id === 'pme' || profile.id === 'technicien' || profile.id === 'manager' || profile.id === 'etat') {
                setSelectedProfile(profile);
            } else {
                onClose();
                navigate('/login');
            }
        }
    };

    const handleBackFromForm = () => {
        setSelectedProfile(null);
    };

    const handleCloseForm = () => {
        setSelectedProfile(null);
        // Fermer complètement la modale et retourner à la page d'accueil
        // Nettoyer sessionStorage
        sessionStorage.removeItem('selectedRole');
        sessionStorage.removeItem('selectedProfileId');
        // Naviguer vers la page d'accueil
        navigate('/');
        // Appeler onClose pour fermer la modale
        onClose();
    };

    // Si un profil est sélectionné en mode inscription, afficher le formulaire d'inscription modal
    if (isRegister && selectedProfile) {
        return (
            <RegisterModal
                profileId={selectedProfile.id}
                role={selectedProfile.role}
                profileTitle={selectedProfile.title}
                onClose={handleCloseForm}
                onBack={handleBackFromForm}
            />
        );
    }

    // Si un profil est sélectionné en mode connexion (citoyen, PME, technicien, manager ou etat), afficher le formulaire de connexion modal
    if (isLogin && selectedProfile && (selectedProfile.id === 'citoyen' || selectedProfile.id === 'pme' || selectedProfile.id === 'technicien' || selectedProfile.id === 'manager' || selectedProfile.id === 'etat')) {
        return (
            <LoginModal
                profileId={selectedProfile.id}
                profileTitle={selectedProfile.title}
                onClose={handleCloseForm}
                onBack={handleBackFromForm}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay vert */}
            <div
                className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Carte modale */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête avec bouton fermer */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isRegister ? 'Inscription' : 'Connexion'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Sélectionnez votre profil</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
                        aria-label="Quitter"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Quitter</span>
                    </button>
                </div>

                {/* Grille de cartes en disposition 2-2-1 */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {/* Première ligne : 2 cartes */}
                        {profiles.slice(0, 2).map((profile) => {
                            const Icon = profile.icon;
                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => handleProfileSelect(profile)}
                                    className={`bg-white rounded-xl shadow-md border-2 ${profile.borderColor} p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group`}
                                >
                                    <div className={`w-14 h-14 ${profile.bgColor} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${profile.color}`} />
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${profile.color}`}>
                                        {profile.title}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {profile.subtitle}
                                    </p>
                                </button>
                            );
                        })}

                        {/* Deuxième ligne : 2 cartes */}
                        {profiles.slice(2, 4).map((profile) => {
                            const Icon = profile.icon;
                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => handleProfileSelect(profile)}
                                    className={`bg-white rounded-xl shadow-md border-2 ${profile.borderColor} p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group`}
                                >
                                    <div className={`w-14 h-14 ${profile.bgColor} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${profile.color}`} />
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${profile.color}`}>
                                        {profile.title}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {profile.subtitle}
                                    </p>
                                </button>
                            );
                        })}

                        {/* Troisième ligne : 1 carte centrée */}
                        {profiles.slice(4, 5).map((profile) => {
                            const Icon = profile.icon;
                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => handleProfileSelect(profile)}
                                    className={`bg-white rounded-xl shadow-md border-2 ${profile.borderColor} p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group col-span-2 max-w-xs mx-auto`}
                                >
                                    <div className={`w-14 h-14 ${profile.bgColor} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${profile.color}`} />
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${profile.color}`}>
                                        {profile.title}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {profile.subtitle}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

