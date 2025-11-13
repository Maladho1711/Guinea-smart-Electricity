import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, X, Users, Shield, LogIn, Building2, Mail, Lock, Wrench, BarChart3, Globe } from 'lucide-react';
import logoImage from "../../assets/guineaSmart.jpg";

interface LoginModalProps {
    profileId: string;
    profileTitle: string;
    onClose: () => void;
    onBack: () => void;
}

export function LoginModal({ profileId, onClose, onBack }: LoginModalProps) {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isCitoyen = profileId === 'citoyen';
    const isPME = profileId === 'pme';
    const isTechnicien = profileId === 'technicien';
    const isManager = profileId === 'manager';
    const isEtat = profileId === 'etat';

    // Empêcher le scroll de l'arrière-plan
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isCitoyen) {
                // Pour les citoyens, on exige email/password pour une vraie authentification
                if (!email || !password) {
                    setError('Veuillez saisir votre email et mot de passe pour vous connecter.');
                    setLoading(false);
                    return;
                }

                // Essayer de se connecter avec email/password - AUTHENTIFICATION RÉELLE REQUISE
                try {
                    console.log('🔐 Tentative de connexion citoyen avec email:', email);
                    await signIn(email, password, 'citoyen');
                    // signIn a déjà stocké le token et l'utilisateur dans localStorage
                    // Vérifier que le token existe
                    const token = localStorage.getItem('token');
                    const storedUser = localStorage.getItem('user');
                    console.log('✅ Connexion réussie, token:', token ? 'présent' : 'absent', 'user:', storedUser ? 'présent' : 'absent');

                    if (token && storedUser) {
                        // Connexion réussie avec compte backend
                        onClose();
                        // Rediriger vers la page d'accueil qui affichera automatiquement le dashboard citoyen
                        navigate('/');
                        // Attendre un peu pour que le contexte se mette à jour
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                    } else {
                        throw new Error('Token ou utilisateur non reçu après connexion');
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
                    console.error('❌ Erreur de connexion citoyen:', errorMessage);

                    // Vérifier si l'erreur contient des suggestions de rôles disponibles
                    const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;

                    let errorMsg = errorMessage.includes('serveur backend')
                        ? errorMessage
                        : 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants ou vous inscrire si vous n\'avez pas encore de compte.';

                    // Si des rôles sont disponibles, améliorer le message
                    if (availableRoles && availableRoles.length > 0) {
                        const roleNames: Record<string, string> = {
                            'citoyen': 'Citoyen',
                            'pme': 'PME',
                            'technicien': 'Technicien',
                            'manager': 'Manager',
                            'etat': 'État'
                        };
                        const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                        errorMsg = `Cet email n'a pas de compte ${isCitoyen ? 'Citoyen' : 'pour ce profil'}. Veuillez vous connecter avec le profil : ${formattedRoles}`;
                    }

                    setError(errorMsg);
                    setLoading(false);
                    // NE PAS créer de session simplifiée - exiger une vraie authentification
                }
            } else if (isPME) {
                // Connexion pour PME avec email/password et redirection vers le dashboard PME
                try {
                    await signIn(email, password, 'pme');
                    // signIn a déjà stocké le token et l'utilisateur dans localStorage
                    const token = localStorage.getItem('token');
                    const storedUser = localStorage.getItem('user');
                    if (token && storedUser) {
                        onClose();
                        navigate('/pme-dashboard');
                    } else {
                        throw new Error('Token ou utilisateur non reçu après connexion');
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
                    const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;
                    let errorMsg = errorMessage.includes('serveur backend')
                        ? errorMessage
                        : 'Email ou mot de passe incorrect';
                    if (availableRoles && availableRoles.length > 0) {
                        const roleNames: Record<string, string> = {
                            'citoyen': 'Citoyen',
                            'pme': 'PME',
                            'technicien': 'Technicien',
                            'manager': 'Manager',
                            'etat': 'État'
                        };
                        const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                        errorMsg = `Cet email n'a pas de compte pour le profil "PME". Veuillez vous connecter avec le profil : ${formattedRoles}`;
                    }
                    setError(errorMsg);
                    setLoading(false);
                }
            } else if (isTechnicien) {
                // Connexion pour Technicien avec email/password et redirection vers le dashboard technicien
                try {
                    await signIn(email, password, 'technicien');
                    const token = localStorage.getItem('token');
                    const storedUser = localStorage.getItem('user');
                    if (token && storedUser) {
                        onClose();
                        navigate('/technician-dashboard');
                    } else {
                        throw new Error('Token ou utilisateur non reçu après connexion');
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
                    const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;
                    let errorMsg = errorMessage.includes('serveur backend')
                        ? errorMessage
                        : 'Email ou mot de passe incorrect';
                    if (availableRoles && availableRoles.length > 0) {
                        const roleNames: Record<string, string> = {
                            'citoyen': 'Citoyen',
                            'pme': 'PME',
                            'technicien': 'Technicien',
                            'manager': 'Manager',
                            'etat': 'État'
                        };
                        const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                        errorMsg = `Cet email n'a pas de compte pour le profil "Technicien". Veuillez vous connecter avec le profil : ${formattedRoles}`;
                    }
                    setError(errorMsg);
                    setLoading(false);
                }
            } else if (isManager) {
                // Connexion pour Manager avec email/password et redirection vers le dashboard manager
                try {
                    await signIn(email, password, 'manager');
                    const token = localStorage.getItem('token');
                    const storedUser = localStorage.getItem('user');
                    if (token && storedUser) {
                        onClose();
                        navigate('/manager-dashboard');
                    } else {
                        throw new Error('Token ou utilisateur non reçu après connexion');
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
                    const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;
                    let errorMsg = errorMessage.includes('serveur backend')
                        ? errorMessage
                        : 'Email ou mot de passe incorrect';
                    if (availableRoles && availableRoles.length > 0) {
                        const roleNames: Record<string, string> = {
                            'citoyen': 'Citoyen',
                            'pme': 'PME',
                            'technicien': 'Technicien',
                            'manager': 'Manager',
                            'etat': 'État'
                        };
                        const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                        errorMsg = `Cet email n'a pas de compte pour le profil "Manager". Veuillez vous connecter avec le profil : ${formattedRoles}`;
                    }
                    setError(errorMsg);
                    setLoading(false);
                }
            } else if (isEtat) {
                // Connexion pour État avec email/password et redirection vers le dashboard État
                try {
                    await signIn(email, password, 'etat');
                    const token = localStorage.getItem('token');
                    const storedUser = localStorage.getItem('user');
                    if (token && storedUser) {
                        onClose();
                        navigate('/etat-dashboard');
                    } else {
                        throw new Error('Token ou utilisateur non reçu après connexion');
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
                    const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;
                    let errorMsg = errorMessage.includes('serveur backend')
                        ? errorMessage
                        : 'Email ou mot de passe incorrect';
                    if (availableRoles && availableRoles.length > 0) {
                        const roleNames: Record<string, string> = {
                            'citoyen': 'Citoyen',
                            'pme': 'PME',
                            'technicien': 'Technicien',
                            'manager': 'Manager',
                            'etat': 'État'
                        };
                        const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                        errorMsg = `Cet email n'a pas de compte pour le profil "État". Veuillez vous connecter avec le profil : ${formattedRoles}`;
                    }
                    setError(errorMsg);
                    setLoading(false);
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';

            // Vérifier si l'erreur contient des suggestions de rôles disponibles
            const availableRoles = (error as { availableRoles?: string[] })?.availableRoles;

            let errorMsg = errorMessage.includes('serveur backend')
                ? errorMessage
                : 'Email ou mot de passe incorrect';

            // Si des rôles sont disponibles, améliorer le message
            if (availableRoles && availableRoles.length > 0) {
                const roleNames: Record<string, string> = {
                    'citoyen': 'Citoyen',
                    'pme': 'PME',
                    'technicien': 'Technicien',
                    'manager': 'Manager',
                    'etat': 'État'
                };
                const profileNames: Record<string, string> = {
                    'citoyen': 'Citoyen',
                    'pme': 'PME',
                    'technicien': 'Technicien',
                    'manager': 'Manager',
                    'etat': 'État'
                };
                const currentProfile = profileNames[profileId] || profileId;
                const formattedRoles = availableRoles.map((r: string) => roleNames[r] || r).join(', ');
                errorMsg = `Cet email n'a pas de compte pour le profil "${currentProfile}". Veuillez vous connecter avec le profil : ${formattedRoles}`;
            } else if (isCitoyen) {
                errorMsg = 'Erreur lors de l\'envoi du code. Veuillez réessayer.';
            }

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        onClose();
        navigate('/select-profile?mode=register');
    };

    // Formulaire spécifique pour Citoyen
    if (isCitoyen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Overlay vert */}
                <div
                    className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Carte modale */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* En-tête */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Retour</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Formulaire dans une carte */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <div className="relative bg-red-50 border-red-200 border-2 rounded-full p-3 shadow-lg">
                                        <Users className="w-10 h-10 text-red-600" strokeWidth={2} />
                                        <div className="absolute -bottom-1 -right-1 bg-red-50 border-red-200 border-2 rounded-full p-1">
                                            <LogIn className="w-3.5 h-3.5 text-red-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* En-tête */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion Citoyen</h2>
                                    <p className="text-gray-600">Connectez-vous avec votre email et mot de passe</p>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre.email@exemple.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Votre mot de passe"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Connexion...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors font-medium"
                                >
                                    Inscrire mon compteur
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire pour PME
    if (isPME) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Overlay vert */}
                <div
                    className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Carte modale */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* En-tête */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Retour</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Formulaire dans une carte */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <div className="relative bg-yellow-50 border-yellow-200 border-2 rounded-full p-3 shadow-lg">
                                        <Building2 className="w-10 h-10 text-yellow-600" strokeWidth={2} />
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-50 border-yellow-200 border-2 rounded-full p-1">
                                            <LogIn className="w-3.5 h-3.5 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* En-tête */}
                                <div className="text-center mb-6">
                                    <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion PME</h2>
                                    <p className="text-gray-600">Accédez à votre espace entreprise</p>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="contact@entreprise.gn"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Connexion...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors font-medium"
                                >
                                    Inscrire mon entreprise
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire pour Technicien
    if (isTechnicien) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Overlay vert */}
                <div
                    className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Carte modale */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* En-tête */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Retour</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Formulaire dans une carte */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <div className="relative bg-yellow-50 border-yellow-200 border-2 rounded-full p-3 shadow-lg">
                                        <Wrench className="w-10 h-10 text-yellow-600" strokeWidth={2} />
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-50 border-yellow-200 border-2 rounded-full p-1">
                                            <LogIn className="w-3.5 h-3.5 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* En-tête */}
                                <div className="text-center mb-6">
                                    <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion Technicien EDG</h2>
                                    <p className="text-gray-600">Accédez à votre espace technique</p>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="technicien@edg.gn"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Connexion...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors font-medium"
                                >
                                    Créer un compte technicien
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire pour Manager
    if (isManager) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Overlay vert */}
                <div
                    className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Carte modale */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* En-tête */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Retour</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Formulaire dans une carte */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <div className="relative bg-green-50 border-green-200 border-2 rounded-full p-3 shadow-lg">
                                        <BarChart3 className="w-10 h-10 text-green-600" strokeWidth={2} />
                                        <div className="absolute -bottom-1 -right-1 bg-green-50 border-green-200 border-2 rounded-full p-1">
                                            <LogIn className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* En-tête */}
                                <div className="text-center mb-6">
                                    <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion Manager</h2>
                                    <p className="text-gray-600">Créez votre compte de gestion EDG</p>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="prenom.nom@edg.gn"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Connexion...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-gray-600 text-sm">
                                    Déjà un compte ?{' '}
                                    <button
                                        type="button"
                                        onClick={handleRegister}
                                        className="text-green-600 font-semibold hover:underline"
                                    >
                                        Se connecter
                                    </button>
                                </p>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors font-medium"
                                >
                                    Retour à l'accueil
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire pour État
    if (isEtat) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Overlay vert */}
                <div
                    className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Carte modale */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* En-tête */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Retour</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Formulaire dans une carte */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 m-3">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <div className="relative bg-blue-50 border-blue-200 border-2 rounded-full p-3 shadow-lg">
                                        <Globe className="w-10 h-10 text-blue-600" strokeWidth={2} />
                                        <div className="absolute -bottom-1 -right-1 bg-blue-50 border-blue-200 border-2 rounded-full p-1">
                                            <LogIn className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* En-tête */}
                                <div className="text-center mb-6">
                                    <h1 className="text-lg font-bold text-green-600 mb-1">Guinea Smart Electricity</h1>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Espace État</h2>
                                    <p className="text-gray-600">Accès réservé au Ministère de l'Énergie</p>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email officiel
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="prenom.nom@energie.gov.gn"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Connexion...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full text-center text-gray-600 text-sm hover:text-green-700 transition-colors font-medium"
                                >
                                    Retour à l'accueil
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire par défaut pour les autres profils (à implémenter si nécessaire)
    return null;
}

