'use server'

import { fetchRestApi } from "@/utils/api";

interface RegisterData {
  username: string
  email: string
  password: string
}

interface RegisterResponse {
  success: boolean
  message?: string
  data?: object
  error?: string
}

/**
 * Server Action pour l'inscription d'un nouvel utilisateur
 * Compatible avec useActionState - accepte FormData
 * @param prevState - L'état précédent (pour useActionState)
 * @param formData - Les données du formulaire
 * @returns Le résultat de l'inscription
 */
export async function registerUser(
  prevState: RegisterResponse | null,
  formData: FormData
): Promise<RegisterResponse> {
  try {
    console.log('registerUser', formData)
    // Extraction des données du FormData
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validation côté serveur
    if (!username || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: 'Tous les champs sont requis',
      }
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Les mots de passe ne correspondent pas',
      }
    }

    // Validation de la longueur du mot de passe
    if (password.length < 5) {
      return {
        success: false,
        error: 'Le mot de passe doit contenir au moins 5 caractères',
      }
    }

    // Envoi de la requête au backend
    const response = await fetchRestApi('users', 'POST', { username, email, password })

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur lors de l\'inscription' }))
      return {
        success: false,
        error: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
      }
    }

    const userData = await response.json()
    console.log('userData', userData)

    return {
      success: true,
      message: 'Inscription réussie !',
      data: userData,
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
    }
  }
}

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message?: string
  data?: object
  error?: string
}

/**
 * Server Action pour la connexion d'un utilisateur
 * @param data - Les données du formulaire de connexion
 * @returns Le résultat de la connexion
 */
export async function loginUser(data: LoginData): Promise<LoginResponse> {
  try {
    // URL du backend (à adapter selon votre configuration)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'
    // Note: Vous devrez peut-être créer une route /api/auth/login dans votre backend
    const apiUrl = `${backendUrl}/api/auth/login`

    // Envoi de la requête au backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur lors de la connexion' }))
      return {
        success: false,
        error: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
      }
    }

    const userData = await response.json()

    return {
      success: true,
      message: 'Connexion réussie !',
      data: userData,
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
    }
  }
}
