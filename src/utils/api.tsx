export const fetchRestApi = async (
  endpoint: string,
  method: string,
  payload: object
) => {
  const baseUrl = process.env.NEXT_PUBLIC_REST_ENDPOINT;
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json", // Indique que la charge utile est au format JSON
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
