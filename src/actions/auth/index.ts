"use server";

import { fetchRestApi } from "@/utils/api";
import { cookies } from "next/headers";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: object;
  error?: string;
}

// interface LoginData {
//   email: string
//   password: string
// }

// interface LoginResponse {
//   success: boolean
//   message?: string
//   data?: object
//   error?: string
// }

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
    const cookieStore = await cookies();
    console.log("registerUser", formData);
    // Extraction des données du FormData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation côté serveur
    if (!username || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: "Tous les champs sont requis",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Les mots de passe ne correspondent pas",
      };
    }

    // Validation de la longueur du mot de passe
    if (password.length < 5) {
      return {
        success: false,
        error: "Le mot de passe doit contenir au moins 5 caractères",
      };
    }

    // Envoi de la requête au backend
    const response = await fetchRestApi("auth/register", "POST", {
      username,
      email,
      password,
    });
    console.log("response", response);

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = response.data || {
        message: "Erreur lors de l'inscription",
      };
      return {
        success: false,
        error:
          errorData.message ||
          `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const userData = response.data;
    console.log("userData", userData);

    cookieStore.set("jwt", userData.token);

    return {
      success: true,
      message: "Inscription réussie !",
      data: userData,
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite",
    };
  }
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: object;
  error?: string;
}

/**
 * Server Action pour la connexion d'un utilisateur
 * @param data - Les données du formulaire de connexion
 * @returns Le résultat de la connexion
 */
export async function loginUser(
  prevState: RegisterResponse | null,
  formData: FormData
): Promise<LoginResponse> {
  try {
    console.log("loginUser", formData);
    // Extraction des données du FormData
    const email = formData.get("email");
    const password = formData.get("password");

    // // URL du backend (à adapter selon votre configuration)
    // const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'
    // // Note: Vous devrez peut-être créer une route /api/auth/login dans votre backend
    // const apiUrl = `${backendUrl}/api/auth/login`

    // // Envoi de la requête au backend
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: data.email,
    //     password: data.password,
    //   }),
    // })

    const response = await fetchRestApi("auth/login", "POST", {
      email,
      password,
    });
    console.log("response", response);

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = response.data || {
        message: "Erreur lors de la connexion",
      };
      return {
        success: false,
        error:
          errorData.message ||
          `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const userData = await response.data;
    console.log("userData", userData);

    const cookieStore = await cookies();
    cookieStore.set("jwt", userData.token);

    return {
      success: true,
      message: "Connexion réussie !",
      data: userData,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite",
    };
  }
}
