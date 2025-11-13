// Configuration de l'API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
  users: `${API_BASE_URL}/api/users`,
  projects: `${API_BASE_URL}/api/projects`,
  tickets: `${API_BASE_URL}/api/tickets`,
  eva: {
    chat: `${API_BASE_URL}/api/eva/chat`,
  },
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
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
        const validationErrors = errorData.details
          .map((detail: any) => `${detail.field}: ${detail.message}`)
          .join(', ');
        if (validationErrors) {
          errorMessage = `${errorMessage}. ${validationErrors}`;
        }
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      // Propager les informations supplémentaires de l'erreur
      if (errorData.availableRoles) {
        (error as any).availableRoles = errorData.availableRoles;
      }
      if (errorData.suggestedRole) {
        (error as any).suggestedRole = errorData.suggestedRole;
      }
      if (errorData.details) {
        (error as any).details = errorData.details;
      }
      throw error;
    }

    return response.json();
  } catch (error: any) {
    // Gestion spécifique des erreurs de connexion
    if (error.message === 'Failed to fetch' || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('NetworkError')) {
      const connectionError = new Error('Le serveur backend n\'est pas accessible. Veuillez vérifier que le serveur est démarré sur http://localhost:3000');
      (connectionError as any).status = 0;
      (connectionError as any).isConnectionError = true;
      throw connectionError;
    }
    throw error;
  }
};

