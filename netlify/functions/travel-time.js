// Calcula o tempo de deslocamento real entre dois pontos usando a
// Routes API do Google (substituta da antiga Distance Matrix API).
// Roda como função serverless (não expõe a chave da API no navegador).
//
// Configuração necessária (ver LEIA-ME.md):
//   1. No Google Cloud, ativar a "Routes API" (Library → buscar "Routes API" → Enable)
//   2. Definir a variável de ambiente GOOGLE_MAPS_API_KEY no Netlify
//   3. No index.html, definir CONFIG.TRAVEL_TIME_FUNCTION_URL como
//      "/.netlify/functions/travel-time"

exports.handler = async (event) => {
  const { origin, destination, mode } = event.queryStringParameters || {};

  if (!origin || !destination) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Informe origin e destination." })
    };
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GOOGLE_MAPS_API_KEY não configurada." })
    };
  }

  const travelModeMap = { driving: "DRIVE", walking: "WALK", bicycling: "BICYCLE", transit: "TRANSIT" };
  const travelMode = travelModeMap[mode] || "DRIVE";

  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        travelMode
      })
    });
    const data = await res.json();
    const route = data?.routes?.[0];

    if (!route) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          durationText: null,
          error: "Rota não encontrada.",
          debug: data
        })
      };
    }

    const seconds = parseInt(route.duration, 10) || 0;
    const minutes = Math.round(seconds / 60);
    const km = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(1) : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        durationText: `${minutes} min`,
        durationSeconds: seconds,
        distanceText: km ? `${km} km` : null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falha ao consultar o Google Maps." })
    };
  }
};
