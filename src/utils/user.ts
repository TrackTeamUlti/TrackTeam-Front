/**
 * Utilitaire pour gérer l'utilisateur actuel
 * TODO: Intégrer avec votre système d'authentification réel
 */

export interface CurrentUser {
  id: string | number;
  username: string;
  email: string;
}

/**
 * Récupère l'utilisateur actuel depuis localStorage
 * En production, vous devriez récupérer cela depuis votre contexte/auth
 */
export const getCurrentUser = (): CurrentUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  }
  
  // Pour les tests, retourner un utilisateur par défaut
  // TODO: Remplacer par votre logique d'authentification réelle
  return {
    id: '1',
    username: 'Utilisateur Test',
    email: 'test@example.com',
  };
};

/**
 * Définit l'utilisateur actuel
 */
export const setCurrentUser = (user: CurrentUser | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};
