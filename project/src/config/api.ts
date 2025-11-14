// Configuration de l'API backend
// En production, VITE_API_URL doit être défini dans les variables d'environnement Vercel
// Exemple: https://votre-backend.railway.app
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;

  // Si VITE_API_URL est défini, l'utiliser
  if (envUrl) {
    return envUrl;
  }

  // En développement, utiliser localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  // En production sans VITE_API_URL, essayer de détecter automatiquement
  // ou utiliser une URL par défaut (à configurer)
  console.error('❌ VITE_API_URL n\'est pas défini. Veuillez configurer cette variable dans Vercel.');
  console.error('💡 Ajoutez VITE_API_URL dans les variables d\'environnement Vercel avec l\'URL de votre backend Railway.');

  // Fallback: essayer de construire l'URL depuis la fenêtre actuelle (ne fonctionne pas toujours)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Si on est sur Vercel, essayer de deviner l'URL du backend
    // Cette logique peut être adaptée selon votre configuration
    return `https://${hostname.replace(/^[^.]+/, 'backend')}`;
  }

  // Dernier recours: retourner une URL vide pour forcer l'erreur
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
  users: `${API_BASE_URL}/api/users`,
  projects: `${API_BASE_URL}/api/projects`,
  tickets: `${API_BASE_URL}/api/tickets`,
  alerts: `${API_BASE_URL}/api/alerts`,
  analysis: `${API_BASE_URL}/api/analysis`,
  eva: {
    chat: `${API_BASE_URL}/api/eva/chat`,
  },
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        console.error('❌ Erreur API - Réponse non-JSON:', text);
        errorData = { error: `Erreur HTTP: ${response.status}` };
      }
      console.error('❌ Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error,
        details: errorData.details,
        url: url
      });

      // Construire un message d'erreur détaillé
      let errorMessage = errorData.error || `Erreur HTTP: ${response.status}`;

      // Si des détails de validation sont présents, les ajouter au message
      if (errorData.details && Array.isArray(errorData.details)) {
        interface ValidationDetail {
          field: string;
          message: string;
        }
        const validationErrors = (errorData.details as ValidationDetail[])
          .map((detail) => `${detail.field}: ${detail.message}`)
          .join(', ');
        if (validationErrors) {
          errorMessage = `${errorMessage}. ${validationErrors}`;
        }
      }

      interface ApiError extends Error {
        status?: number;
        availableRoles?: string[];
        suggestedRole?: string;
        details?: unknown;
      }

      const error: ApiError = new Error(errorMessage);
      error.status = response.status;
      // Propager les informations supplémentaires de l'erreur
      if (errorData.availableRoles) {
        error.availableRoles = errorData.availableRoles;
      }
      if (errorData.suggestedRole) {
        error.suggestedRole = errorData.suggestedRole;
      }
      if (errorData.details) {
        error.details = errorData.details;
      }
      throw error;
    }

    return response.json();
  } catch (error: unknown) {
    // Gestion spécifique des erreurs de connexion
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === 'Failed to fetch' || errorMessage.includes('ERR_CONNECTION_REFUSED') || errorMessage.includes('NetworkError') || errorMessage.includes('CORS')) {
      const isProduction = import.meta.env.PROD;
      const backendUrl = API_BASE_URL || 'non configuré';

      let connectionErrorMessage = 'Le serveur backend n\'est pas accessible.';
      if (isProduction) {
        connectionErrorMessage += `\n\nVérifiez que:\n`;
        connectionErrorMessage += `1. Le backend est déployé et fonctionne sur: ${backendUrl}\n`;
        connectionErrorMessage += `2. La variable VITE_API_URL est correctement configurée dans Vercel\n`;
        connectionErrorMessage += `3. Le backend accepte les requêtes CORS depuis votre domaine Vercel\n`;
        connectionErrorMessage += `4. Le backend est accessible publiquement (pas de restriction IP)`;
      } else {
        connectionErrorMessage += `\n\nVérifiez que le serveur backend est démarré sur ${backendUrl}`;
      }

      interface ConnectionError extends Error {
        status: number;
        isConnectionError: boolean;
        backendUrl: string;
      }

      const connectionError: ConnectionError = new Error(connectionErrorMessage) as ConnectionError;
      connectionError.status = 0;
      connectionError.isConnectionError = true;
      connectionError.backendUrl = backendUrl;
      throw connectionError;
    }
    throw error;
  }
};

