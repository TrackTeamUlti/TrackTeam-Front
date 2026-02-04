'use server'

import { cookies } from 'next/headers'
import { fetchRestApi } from '@/utils/api'

interface CreateEventData {
  title: string
  start: string
  end: string
  all_day: boolean
  description?: string
}

interface CreateEventResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

/**
 * Server Action pour créer un événement
 * @param data - Les données de l'événement
 * @returns Le résultat de la création
 */
export async function createEvent(data: CreateEventData): Promise<CreateEventResponse> {
  console.log('Données reçues pour la création de l\'événement:', data)
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    // console.log('Token JWT récupéré depuis les cookies:', token)

    if (!token) {
      return {
        success: false,
        error: 'Vous devez être connecté pour créer un événement',
      }
    }

    const response = await fetchRestApi("events", "POST", {
      title: data.title,
      start: data.start,
      end: data.end,
      all_day: data.all_day,
      description: data.description || null,
    }, token)

    // URL du backend
    // const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'
    // const apiUrl = `${backendUrl}/event`

    // Envoi de la requête au backend
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     title: data.title,
    //     start: data.start,
    //     end: data.end,
    //     all_day: data.all_day,
    //     description: data.description || null,
    //   }),
    // })

    console.log('Réponse de la création de l\'événement:', response)

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.data.catch(() => ({ 
        message: 'Erreur lors de la création de l\'événement' 
      }))
      return {
        success: false,
        error: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
      }
    }

    const eventData = await response.data

    return {
      success: true,
      message: 'Événement créé avec succès',
      data: eventData,
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
    }
  }
}
