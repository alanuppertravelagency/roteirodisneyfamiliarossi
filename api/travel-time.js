// Calcula o tempo de deslocamento real entre dois pontos usando a
// Routes API do Google. Formato de função serverless da Vercel
// (diferente do formato usado no Netlify).
//
// Configuração necessária:
//   1. No Google Cloud, ativar a "Routes API"
//   2. Definir a variável de ambiente GOOGLE_MAPS_API_KEY no Vercel
//   3. No index.html, TRAVEL_TIME_FUNCTION_URL já está como "/api/travel-time"

module.exports = async (req, res) => {
  const { origin, destination, mode } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Informe origin e destination." });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY não configurada." });
  }

  const travelModeMap = { driving: "DRIVE", walking: "WALK", bicycling: "BICYCLE", transit: "TRANSIT" };
  const travelMode = travelModeMap[mode] || "DRIVE";

  try {
    const apiRes = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
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
    const data = await apiRes.json();
    const route = data?.routes?.[0];

    if (!route) {
      return res.status(200).json({ durationText: null, error: "Rota não encontrada.", debug: data });
    }

    const seconds = parseInt(route.duration, 10) || 0;
    const minutes = Math.round(seconds / 60);
    const km = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(1) : null;

    return res.status(200).json({
      durationText: `${minutes} min`,
      durationSeconds: seconds,
      distanceText: km ? `${km} km` : null
    });
  } catch (err) {
    return res.status(500).json({ error: "Falha ao consultar o Google Maps." });
  }
};
