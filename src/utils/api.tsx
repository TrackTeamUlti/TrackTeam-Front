export const fetchRestApi = async (
  endpoint: string,
  method: string,
  payload: object,
  token?: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_REST_ENDPOINT;
  try {
    const headers: any = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: method,
      headers,
      body: JSON.stringify(payload),
    });
    console.log('response fetchRestApi', response)
    const data = await response.json();
    // Retourner un objet avec les métadonnées de la réponse et les données
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
